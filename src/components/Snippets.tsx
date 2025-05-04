import { FC, useContext, useMemo, useRef, useState } from "react";
import { ISnippet } from "../models";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { ContentCopy, Delete, Edit } from "@mui/icons-material";
import { GlobalProvider } from "../contexts/GlobalContext";
import { SnackBarContext } from "../contexts/SnackBarContext";

export interface IEditSnippet extends ISnippet {
  category: string;
}

interface ISnippetsProps {
  category: string;
  snippets: ISnippet[];
  onEditSnippetClick(item: IEditSnippet): void;
}

const SnippetContent: FC<{ content: string }> = ({ content }) => {
  const [openTooltip, setOpenTooltip] = useState(false);
  const timerRef = useRef<number>(undefined);

  return (
    <Tooltip title="Copied" placement="top" arrow open={openTooltip}>
      <ListItemButton
        onClick={() => {
          clearTimeout(timerRef.current);
          setOpenTooltip(true);
          navigator.clipboard.writeText(content);
          timerRef.current = setTimeout(() => {
            setOpenTooltip(false);
          }, 1000);
        }}
      >
        <ListItemText primary={content} sx={{ wordBreak: "break-all" }} />
        <ListItemIcon sx={{ justifyContent: "flex-end" }}>
          <ContentCopy />
        </ListItemIcon>
      </ListItemButton>
    </Tooltip>
  );
};

const Snippets: FC<ISnippetsProps> = ({
  category,
  snippets,
  onEditSnippetClick,
}) => {
  const { snippetCategoryStore, loadSnippetCategory } =
    useContext(GlobalProvider);
  const { openSnackBar } = useContext(SnackBarContext);
  const groupedSnippets = useMemo(() => {
    return snippets.reduce((acc, snippet) => {
      if (acc[snippet.group]) {
        acc[snippet.group].push(snippet);
      } else {
        acc[snippet.group] = [snippet];
      }
      return acc;
    }, {} as Record<string, ISnippet[]>);
  }, [snippets]);

  const handleDeleteClick = (id: string) => {
    snippetCategoryStore
      .findOneAndUpdate(category, (oldDoc) => {
        const newDoc = { ...oldDoc };
        newDoc.snippets = newDoc.snippets.filter((s) => s.id !== id);
        return newDoc;
      })
      .then(() => loadSnippetCategory())
      .then(() => {
        openSnackBar({
          msg: "Snippet has deleted successfully",
          severity: "success",
        });
      })
      .catch((e) => {
        console.log(e);
        openSnackBar({
          msg: "Snippet has deleted successfully",
          severity: "error",
        });
      });
  };

  return (
    <>
      {Object.keys(groupedSnippets).length === 0 && (
        <Typography textAlign="center">
          No snippets found, Create snippet to get started!
        </Typography>
      )}
      {Object.entries(groupedSnippets).map(([group, snippets]) => (
        <Accordion key={group} expanded elevation={0}>
          <AccordionSummary>
            <Typography fontWeight="bold">
              {group} : {snippets.length}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {snippets.map((snippet) => (
              <Card key={snippet.id} sx={{ mb: "0.5em" }}>
                <CardContent sx={{ pb: 0 }}>
                  <Typography>{snippet.name}</Typography>
                  <Divider />
                  <List>
                    {snippet.content.map((c, ci) => (
                      <SnippetContent key={ci} content={c.value} />
                    ))}
                  </List>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <IconButton
                    // color="error"
                    onClick={() => {
                      onEditSnippetClick({ ...snippet, category });
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      handleDeleteClick(snippet.id);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default Snippets;
