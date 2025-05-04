import { FC, useContext, useEffect, useState } from "react";
import { GlobalProvider } from "../contexts/GlobalContext";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useFieldArray, useForm } from "react-hook-form";
import { IEditSnippet } from "./Snippets";
import { SnackBarContext } from "../contexts/SnackBarContext";

interface IDefaultValues {
  snippetName: string;
  groupName: string;
  categoryName: string;
  contents: Array<{ value: string }>;
}
const defaultValues: IDefaultValues = {
  snippetName: "",
  groupName: "",
  categoryName: "",
  contents: [{ value: "" }],
};

const ContentActionButton = styled(IconButton)({
  alignSelf: "center",
});

interface IAddAddSnippetFormProps {
  editSnippet?: IEditSnippet;
  onClose: () => void;
}

const AddSnippetForm: FC<IAddAddSnippetFormProps> = ({
  editSnippet,
  onClose,
}) => {
  const {
    groups,
    snippetCategories,
    snippetCategoryStore,
    loadSnippetCategory,
  } = useContext(GlobalProvider);
  const { openSnackBar } = useContext(SnackBarContext);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    watch,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<IDefaultValues>({
    defaultValues,
  });
  const { fields, remove, append } = useFieldArray({
    control,
    name: "contents",
  });

  useEffect(() => {
    if (!editSnippet) return;

    reset({
      categoryName: editSnippet.category,
      contents: editSnippet.content,
      groupName: editSnippet.group,
      snippetName: editSnippet.name,
    });
  }, [editSnippet, reset]);

  const formData = watch();

  const addSnippet = () => {
    setIsLoading(true);

    snippetCategoryStore
      .findOneAndUpdate(formData.categoryName, (oldDoc) => {
        const foundSnippet = oldDoc.snippets.find(
          (snippet) => snippet.id === editSnippet?.id
        );

        if (!foundSnippet) {
          oldDoc.snippets.push({
            id: String(Date.now()),
            group: formData.groupName,
            name: formData.snippetName,
            content: formData.contents,
          });
        } else {
          foundSnippet.content = formData.contents;
          foundSnippet.name = formData.snippetName;
          foundSnippet.group = formData.groupName;
        }

        return oldDoc;
      })
      .then(() => {
        return loadSnippetCategory();
      })
      .then(() => {
        if (editSnippet) {
          onClose();
          openSnackBar({
            msg: "Snippet has been updated",
            severity: "success",
          });
        } else {
          openSnackBar({
            msg: "New snippet has been added",
            severity: "success",
          });
        }
        setIsLoading(false);
        reset(defaultValues);
      })
      .catch((e) => {
        console.log(e);

        if (e.name === "ConstraintError") {
          setError("snippetName", {
            type: "validate",
            message: "Group name already exists",
          });
        } else {
          openSnackBar({ msg: "Something went wrong", severity: "error" });
        }
      });
  };

  console.log(errors);

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <Typography component="h2" variant="h5" mb={2}>
        Snippet
      </Typography>
      <form method="POST" onSubmit={handleSubmit(addSnippet)}>
        <Stack gap={2}>
          <TextField
            type="text"
            label="Snippet name"
            id="snippetName"
            {...register("snippetName", {
              required: "Snippet name is required",
              maxLength: {
                value: 255,
                message: "Snippet name must be less then 255 characters",
              },
            })}
            error={!!errors.snippetName?.message}
            helperText={errors.snippetName?.message}
          />
          <FormControl>
            <InputLabel id="category">Category</InputLabel>
            <Select
              labelId="category"
              label="Category"
              value={formData.categoryName}
              {...register("categoryName", {
                required: "Category is required",
              })}
              error={!!errors.categoryName?.message}
              disabled={!!editSnippet}
            >
              {snippetCategories.map((sn) => (
                <MenuItem key={sn.name} value={sn.name}>
                  {sn.name}
                </MenuItem>
              ))}
            </Select>
            {errors.categoryName?.message && (
              <FormHelperText error>
                {errors.categoryName?.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl>
            <InputLabel id="group">Group</InputLabel>
            <Select
              labelId="group"
              label="Group"
              value={formData.groupName}
              {...register("groupName", {
                required: "Group is required",
              })}
              error={!!errors.groupName?.message}
            >
              {groups.map((group) => (
                <MenuItem key={group.name} value={group.name}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
            {errors.groupName?.message && (
              <FormHelperText error>{errors.groupName?.message}</FormHelperText>
            )}
          </FormControl>
          <Stack gap={1}>
            <InputLabel id="contents">Contents</InputLabel>
            <Stack gap={1}>
              {fields.map((field, index, arr) => {
                let action = (
                  <ContentActionButton
                    color="error"
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <Delete />
                  </ContentActionButton>
                );

                if (index === arr.length - 1) {
                  action = (
                    <ContentActionButton
                      onClick={() => {
                        append({ value: "" });
                      }}
                    >
                      <Add />
                    </ContentActionButton>
                  );
                }

                return (
                  <Stack gap={1} direction="row" key={field.id}>
                    <TextField
                      fullWidth
                      type="text"
                      placeholder={`Content ${index + 1}`}
                      {...register(`contents.${index}.value`, {
                        required: "Content is required",
                      })}
                      error={!!errors.contents?.[index]?.value?.message}
                      helperText={errors.contents?.[index]?.value?.message}
                    />
                    {action}
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
          <Stack direction="row" gap={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="error"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {editSnippet ? "Update" : "Create"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </div>
  );
};

export default AddSnippetForm;
