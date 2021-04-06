import { Accordion, AccordionDetails, AccordionSummary, withStyles } from "@material-ui/core";

export const IAccordion = withStyles({
  root: {
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
})(Accordion);

export const IAccordionSummary = withStyles({
  root: {
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(AccordionSummary);

export const IAccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}))(AccordionDetails);
