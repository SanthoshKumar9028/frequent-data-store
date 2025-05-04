import { FC, useContext } from "react";
import { GlobalProvider } from "../contexts/GlobalContext";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useSnackBar } from "../hooks/useSnackBar";

interface IAddCategoryFormProps {
  onClose: () => void;
}

const defaultValues = {
  categoryName: "",
};

const AddCategoryForm: FC<IAddCategoryFormProps> = ({ onClose }) => {
  const { snippetCategoryStore, loadSnippetCategory } =
    useContext(GlobalProvider);
  const { openSnackBar, snackBar } = useSnackBar();
  const {
    watch,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const formData = watch();

  const addCategory = () => {
    snippetCategoryStore
      .add({
        name: formData.categoryName,
        snippets: [],
      })
      .then(() => {
        return loadSnippetCategory();
      })
      .then(() => {
        openSnackBar({
          msg: "New category has been added",
          severity: "success",
        });
        reset(defaultValues);
      })
      .catch((e) => {
        console.log(e);
        if (e.name === "ConstraintError") {
          setError("categoryName", {
            type: "validate",
            message: "Category name already exists",
          });
        } else {
          openSnackBar({ msg: "Something went wrong", severity: "error" });
        }
      });
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <Typography component="h2" variant="h5" mb={2}>
        Category
      </Typography>
      <form method="POST" onSubmit={handleSubmit(addCategory)}>
        <Stack gap={2}>
          <TextField
            type="text"
            label="Category name"
            id="categoryName"
            {...register("categoryName", {
              required: "Category name is required",
              maxLength: {
                value: 255,
                message: "Category name must be less then 255 characters",
              },
            })}
            error={!!errors.categoryName?.message}
            helperText={errors.categoryName?.message}
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

export default AddCategoryForm;
