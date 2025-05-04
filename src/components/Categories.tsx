import { FC, useContext } from "react";
import { GlobalProvider } from "../contexts/GlobalContext";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import Snippets, { IEditSnippet } from "./Snippets";
import { KeyboardArrowDown } from "@mui/icons-material";

const Categories: FC<{ onEditSnippetClick: (item: IEditSnippet) => void }> = ({
  onEditSnippetClick,
}) => {
  const { snippetCategories } = useContext(GlobalProvider);
  return (
    <>
      {snippetCategories.length === 0 && (
        <Typography textAlign="center">
          Create category and snippet to get started!
        </Typography>
      )}
      {snippetCategories.map((snippetCategory) => (
        <Accordion key={snippetCategory.name}>
          <AccordionSummary expandIcon={<KeyboardArrowDown />}>
            <Typography>{snippetCategory.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Snippets
              category={snippetCategory.name}
              snippets={snippetCategory.snippets}
              onEditSnippetClick={onEditSnippetClick}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default Categories;
