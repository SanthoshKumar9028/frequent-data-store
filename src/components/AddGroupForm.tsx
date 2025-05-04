import { FC, useContext } from "react";
import { GlobalProvider } from "../contexts/GlobalContext";
import { TextField, Button, Stack, Typography } from "@mui/material";
import { useSnackBar } from "../hooks/useSnackBar";
import { useForm } from "react-hook-form";

interface IAddGroupFormProps {
  onClose: () => void;
}

const defaultValues = {
  groupName: "",
};

const AddGroupForm: FC<IAddGroupFormProps> = ({ onClose }) => {
  const { groupStore, loadGroups } = useContext(GlobalProvider);
  const { openSnackBar, snackBar } = useSnackBar();
  const {
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const formData = watch();

  const addGroup = () => {
    groupStore
      .add({
        name: formData.groupName,
      })
      .then(() => {
        return loadGroups();
      })
      .then(() => {
        openSnackBar({ msg: "New group has been added", severity: "success" });
        reset(defaultValues);
      })
      .catch((e) => {
        console.log(e);
        openSnackBar({ msg: "Something went wrong", severity: "error" });
      });
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <Typography component="h2" variant="h5" mb={2}>
        Group
      </Typography>
      <form method="POST" onSubmit={handleSubmit(addGroup)}>
        <Stack gap={2}>
          <TextField
            variant="outlined"
            label="Group name"
            type="text"
            placeholder="Group name"
            id="group"
            {...register("groupName", {
              required: "Group name is required",
              maxLength: {
                value: 255,
                message: "Group name must be less then 255 characters",
              },
            })}
            error={!!errors.groupName?.message}
            helperText={errors.groupName?.message}
          />
          <Stack direction="row" gap={2} justifyContent="flex-end">
            <Button variant="contained" color="error" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </Stack>
        </Stack>
      </form>

      {snackBar}
    </div>
  );
};

export default AddGroupForm;
