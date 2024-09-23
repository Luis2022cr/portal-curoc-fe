import {
  usePublishActivityMutation
} from "@/api/servicios/actividades";
import { Role } from "@/api/servicios/usuarios";
import useAuth from "@/api/useAuth";
import { toast } from "react-toastify";

export const PublishButton = ({
  activityOwnerId,
  activityId,
}: {
  activityOwnerId: number;
  activityId: number;
}) => {
  const { userRole, user } = useAuth();

  const [{ loading }, publishActivityMutation] =
    usePublishActivityMutation(activityId);

  const handlePublishActivity = async () => {
    await publishActivityMutation();

    toast.success("Actividad publicada exitosamente");
  };

  const isActoivotyOwnerOrVOAE =
    userRole === Role.VOAE || user?.id === activityOwnerId;

  if (!isActoivotyOwnerOrVOAE) {
    return null;
  }

  return (
    <button
      className="bg-yellow-500 text-white py-2 px-4 rounded-lg"
      onClick={handlePublishActivity}
    >
      {loading ? "Publicando..." : "Publicar"}
    </button>
  );
};
