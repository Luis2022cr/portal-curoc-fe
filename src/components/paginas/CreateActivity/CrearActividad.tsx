/* eslint-disable @typescript-eslint/no-explicit-any */
import { EtiquetasAmbitosActividad } from "@/api/servicios/enums";
import {
  Role,
  roleMapper,
  SimpleUserResponse,
  useGetUsersByRoles,
} from "@/api/servicios/usuarios";
import { CustomError, Pagination } from "@/api/types/common";
import { daysify } from "@/utils/formatDate";
import {
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Divider } from "antd";
import { RefetchFunction } from "axios-hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ActividadCrear,
  Organizer,
  OrganizerType,
  useCreateActivity,
} from "../../../api/servicios/actividadPost";
import { obtenerTodasLasCarreras } from "../../../api/servicios/carreras";
import { obtenerLasOrganizaciones } from "../../../api/servicios/organizaciones";
import { CreateActivityFormValues } from "./types";
import { CustomPageContainer } from "@/components/CustomPageContainer";

const dateFormat = "DD/MM/YYYY HH:mm";

const CrearActividad = () => {
  const [{ loading: isLoading }, createActivitymutation] = useCreateActivity();
  const navigate = useNavigate();
  const [form] = ProForm.useForm();

  const handleSubmit = async (values: ActividadCrear) => {
    const formatedStartDate = daysify(
      values.startDate,
      dateFormat
    ).toISOString();
    const formatedEndDate = daysify(values.endDate, dateFormat).toISOString();

    try {
      await createActivitymutation({
        data: {
          ...values,
          startDate: formatedStartDate,
          endDate: formatedEndDate,
        },
      });
      toast.success("La solicitud de actividad se envió con éxito.");
      navigate(-1);
    } catch (e) {
      const error = e as CustomError;
      if (
        error.response.status === 409 &&
        error.response.data.errors.at(0)?.code ===
          "Activity.ActivityNameAlreadyExists"
      ) {
        toast.error(
          "Ya existe una actividad con este nombre, por favor elija otro."
        );
      }
    }
  };

  const selectedScopes = (ProForm.useWatch("scopes", form) ?? []) as {
    scope: number;
    hours: number;
  }[];

  const getAvailableScopes = (index: number) =>
    Object.entries(EtiquetasAmbitosActividad)
      .map(([value, label]) => ({ value: +value, label }))
      .filter(
        ({ value }) =>
          !selectedScopes.some(
            (selectedScope, i) => selectedScope.scope === value && index !== i
          )
      );

  // al parecer esta libreria no soporta el uso de la misma funcion en dos lugares distintos del mismo componente
  const [, getUsersByRoles] = useGetUsersByRoles();
  const [, getUsersByRoles2] = useGetUsersByRoles();

  const fetchUsersByRoles = async (
    roles: Role[],
    keyWords: string,
    fetchFunc: RefetchFunction<any, Pagination<SimpleUserResponse>>
  ) => {
    const { data } = await fetchFunc({
      params: {
        Query: keyWords,
        ...roles.reduce(
          (acc, role, index) => ({ ...acc, [`Role[${index}]`]: role }),
          {}
        ),
        PageNumber: 1,
        PageSize: 20,
      },
    });
    return data.items.map((user) => ({
      value: user.id,
      label: `${user.names} / ${
        user.careerName ?? "Sin carrera"
      } / ${roleMapper(user.role)}`,
    }));
  };

  return (
    <CustomPageContainer>
      <div className="  shadow-lg rounded-lg p-8 sm:m-0">
        <ProForm<CreateActivityFormValues>
          onFinish={async (values) => {
            const careers: Organizer[] = values.careerId.map((careerId) => ({
              careerId,
              type: OrganizerType.Career,
            }));

            const organizations: Organizer[] = values.organizationId.map(
              (organizationId) => ({
                organizationId,
                type: OrganizerType.Organization,
              })
            );

            const dto = {
              ...values,
              supervisorId: values.supervisorId.value,
              coordinatorId: values.coordinatorId.value,
              foreignCareersIds: values.foreignCareersIds,
              goals: values.goals.map((goal) => goal.goal),
              mainActivities: values.mainActivities.map(
                (activity) => activity.activity
              ),
              organizers: [...careers, ...organizations],
              scopes: values.scopes.map((scope) => ({
                scope: +scope.scope,
                hours: scope.hours,
              })),
            } as ActividadCrear;
            await handleSubmit(dto);
          }}
          dateFormatter={"string"}
          submitter={{
            searchConfig: {
              submitText: "Enviar solicitud",
              resetText: "Limpiar",
            },
            resetButtonProps: {
              disabled: isLoading,
            },
          }}
          loading={isLoading}
          form={form}
          variant="filled"
        >
          <ProFormText
            name="name"
            label="Nombre Actividad"
            placeholder="Ingrese el nombre de la actividad"
            rules={[{ required: true, message: "El nombre es obligatorio" }]}
          />
          <ProFormTextArea
            name="description"
            label="Descripción"
            placeholder="Describa la actividad"
            rules={[
              { required: true, message: "La descripción es obligatoria" },
              {
                min: 4,
                message: "Debe tener al menos 4 caracteres de largo",
              },
            ]}
          />
          <ProFormSelect
            name="foreignCareersIds"
            label="Carreras admitidas"
            mode="multiple"
            request={async () => {
              const response = await obtenerTodasLasCarreras();
              return response.map((carrera) => ({
                value: carrera.id,
                label: carrera.name,
              }));
            }}
            rules={[
              { required: true, message: "Debe seleccionar al menos una" },
            ]}
            placeholder="Seleccione las carreras"
          />
          <ProFormGroup>
            <ProFormDatePicker
              name="startDate"
              label="Fecha de inicio"
              rules={[
                {
                  required: true,
                  message: "Debe seleccionar la fecha de inicio",
                },
                {
                  type: "date",
                  validator: async (_, value) => {
                    if (value && value.isBefore(daysify(new Date()))) {
                      return Promise.reject(
                        new Error(
                          "La fecha de inicio debe ser mayor a la actual"
                        )
                      );
                    }
                  },
                },
              ]}
              fieldProps={{
                format: (value) => (value ? value.format(dateFormat) : ""),
                showTime: true,
              }}
            />

            <ProFormDatePicker
              name="endDate"
              label="Fecha de finalización"
              rules={[
                {
                  required: true,
                  message: "Debe seleccionar la fecha de finalización",
                },
                {
                  type: "date",
                  validator: async (_, value) => {
                    if (
                      value &&
                      value.isBefore(daysify(form.getFieldValue("startDate")))
                    ) {
                      return Promise.reject(
                        new Error(
                          "La fecha de finalización debe ser mayor a la de inicio"
                        )
                      );
                    }
                  },
                },
              ]}
              fieldProps={{
                format: (value) => (value ? value.format(dateFormat) : ""),
                showTime: true,
              }}
            />
          </ProFormGroup>
          <ProFormList
            name="goals"
            label="Objetivos"
            creatorButtonProps={{
              position: "bottom",
              creatorButtonText: "Agregar Objetivo",
            }}
            rules={[
              {
                required: true,
                message: "Debe agregar al menos un objetivo",
                validator: async (_, value) => {
                  if (value.length === 0) {
                    return Promise.reject(
                      new Error("Debe agregar al menos un objetivo")
                    );
                  }
                },
              },
            ]}
          >
            <ProFormText
              name="goal"
              placeholder="Ingrese un objetivo"
              rules={[{ required: true }]}
            />
          </ProFormList>
          <ProFormDigit
            name="totalSpots"
            label="Cupos Totales"
            placeholder="Ingrese el número de cupos"
            min={1}
            rules={[{ required: true }]}
          />
          <ProFormText
            name="location"
            label="Ubicación"
            placeholder="Ingrese la ubicación"
            rules={[
              { required: true },
              {
                min: 4,
                message: "Debe tener al menos 4 caracteres de largo",
              },
            ]}
          />
          <ProFormList
            name="mainActivities"
            label="Actividades Principales"
            creatorButtonProps={{
              position: "bottom",
              creatorButtonText: "Agregar Actividad",
            }}
            rules={[
              {
                required: true,
                message: "Debe agregar al menos una actividad",
                validator: async (_, value) => {
                  if (value.length === 0) {
                    return Promise.reject(
                      new Error("Debe agregar al menos una actividad")
                    );
                  }
                },
              },
            ]}
          >
            <ProFormText
              name="activity"
              placeholder="Ingrese una actividad"
              rules={[{ required: true }]}
            />
          </ProFormList>
          <ProFormList
            name="scopes"
            label="Ámbitos"
            creatorButtonProps={{
              position: "bottom",
              creatorButtonText: "Agregar Ámbito",
              disabled: selectedScopes.length === 5,
            }}
            deleteIconProps={{ tooltipText: "Eliminar" }}
            copyIconProps={{ tooltipText: "Copiar" }}
            rules={[
              {
                required: true,
                message: "Debe agregar al menos un ámbito",
                validator: async (_, value) => {
                  if (value.length === 0) {
                    return Promise.reject(
                      new Error("Debe agregar al menos un ámbito")
                    );
                  }
                },
              },
            ]}
          >
            {(_, index) => {
              const availableScopes = getAvailableScopes(index);

              return (
                <ProFormGroup>
                  <ProFormSelect
                    name={"scope"}
                    options={availableScopes}
                    placeholder="Seleccione el ámbito"
                    rules={[{ required: true }]}
                  />
                  <ProFormDigit
                    name={"hours"}
                    placeholder="Ingrese el número de horas"
                    rules={[
                      { required: true },
                      {
                        type: "number",
                        min: 1,
                        message: "Debe ser mayor a 0",
                      },
                    ]}
                  />
                </ProFormGroup>
              );
            }}
          </ProFormList>
          <Divider>Organizadores</Divider>
          <ProFormSelect
            name="careerId"
            label="Carrera"
            request={async () => {
              const response = await obtenerTodasLasCarreras();
              return response.map((carrera) => ({
                value: carrera.id,
                label: carrera.name,
              }));
            }}
            mode="multiple"
            placeholder="Seleccione una carrera"
            initialValue={[]}
            rules={[
              {
                type: "array",
                //es requerida si no se ah seleccionado una organizacion
                validator: async (_, value) => {
                  const organizationIdlength =
                    form.getFieldValue("organizationId")?.length ?? 0;

                  if (
                    organizationIdlength === 0 &&
                    (value?.length ?? 0) === 0
                  ) {
                    return Promise.reject(
                      new Error("Debe seleccionar al menos una carrera u organización")
                    );
                  }
                },
              },
            ]}
          />
          <ProFormSelect
            name="organizationId"
            label="Organización"
            initialValue={[]}
            request={async () => {
              const response = await obtenerLasOrganizaciones();
              return response.map((org) => ({
                value: org.id,
                label: org.name,
              }));
            }}
            mode="multiple"
            placeholder="Seleccione una organización"
            rules={[
              {
                validator: async (_, value) => {
                  const careerIdlength =
                    form.getFieldValue("careerId")?.length ?? 0;
                  if (careerIdlength === 0 && (value?.length ?? 0) === 0) {
                    return Promise.reject(
                      new Error("Debe seleccionar al menos una organización o carrera")
                    );
                  }
                },
              },
            ]}
          />
          <ProFormSelect.SearchSelect
            name="supervisorId"
            label="Catedrático (Supervisor)"
            request={async ({ keyWords }) =>
              fetchUsersByRoles(
                [Role.TEACHER, Role.VOAE],
                keyWords,
                getUsersByRoles
              )
            }
            debounceTime={500}
            mode="single"
            help="Puede buscar por nombre o correo"
            placeholder="Seleccione un catedrático"
            rules={[{ required: true }]}
          />
          <ProFormSelect.SearchSelect
            name="coordinatorId"
            mode="single"
            help="Puede buscar por nombre o correo"
            label="Encargado de la Actividad (Estudiante/Coordinador)"
            request={async ({ keyWords }) =>
              fetchUsersByRoles([Role.STUDENT], keyWords, getUsersByRoles2)
            }
            valuePropName="value"
            debounceTime={500}
            placeholder="Seleccione un encargado"
            rules={[{ required: true, message: "El encargado es obligatorio" }]}
          />
        </ProForm>
      </div>
    </CustomPageContainer>
  );
};

export default CrearActividad;