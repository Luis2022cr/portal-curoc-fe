import { Scope2 } from "@/api/servicios/actividades";
import {
  EtiquetasAmbitosActividad,
  ActivityScope,
} from "@/api/servicios/enums";
import { useState } from "react";

const RadioWithSubcategories = ({
  handleCheckboxChange,
  scopes,
  selectedOption = {},
}: {
  handleCheckboxChange: (value: {
    scope: ActivityScope;
    checked: boolean;
  }) => void;
  scopes?: Scope2[];
  selectedOption?: { [key: number]: boolean };
}) => {
  const [selectedRadio, setradioSelect140] = useState("");

  const scopesWithValue = scopes?.map((scope) => ({
    ...scope,
    checked: false,
  }));

  const showScholarship = scopes?.some(
    (scope) => scope.scope === ActivityScope.Becas
  );

  const art140Scopes = scopesWithValue?.filter(
    (sco) => sco.scope !== ActivityScope.Becas
  );

  const subcategories =
    art140Scopes?.reduce(
      (acc, scope) => ({ ...acc, [scope.scope]: false }),
      {}
    ) || {};

  return (
    <div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="radio1"
            checked={selectedRadio === "140"}
            onChange={() => {
              setradioSelect140("140");
              handleCheckboxChange({
                checked: false,
                scope: ActivityScope.Becas,
              });
            }}
            className="form-radio text-indigo-600"
          />
          <span className="ml-2 text-gray-700">Horas Voae</span>
        </label>
      </div>

      {selectedRadio === "140" && (
        <div className="flex flex-col space-y-2 ml-5">
          {Object.keys(subcategories).map((key) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                name={key}
                checked={selectedOption[+key]}
                onChange={(e) =>
                  handleCheckboxChange({
                    checked: e.target.checked,
                    scope: +key as ActivityScope,
                  })
                }
                className="form-checkbox text-indigo-600"
              />
              <span className="ml-2 text-gray-600">
                {EtiquetasAmbitosActividad[+key]}
              </span>
            </label>
          ))}
        </div>
      )}

      {showScholarship && (
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="scholarship"
              checked={selectedRadio === "scholarship"}
              onChange={() => {
                setradioSelect140("scholarship");
                handleCheckboxChange({
                  checked: true,
                  scope: ActivityScope.Becas,
                });
              }}
              className="form-checkbox text-indigo-600"
            />
            <span className="ml-2 text-gray-600">Beca</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default RadioWithSubcategories;
