import {
  Box,
  Button,
  createStyles,
  Dialog,
  DialogTitle,
  Icon,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Theme,
} from "@material-ui/core";
import { ColDef, GridApi } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useState } from "react";
import { TextField as FormTextField } from "formik-material-ui";
import { Field, Form, Formik } from "formik";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { background: "#f7f7f7" },
    table: {
      margin: theme.spacing(2),
      marginTop: 0,
      marginBottom: theme.spacing(3),
      width: "auto",
      height: "100%",
    },
    actions: {
      margin: theme.spacing(2),
      marginBottom: 0,
    },
    searchField: { height: 15 },
    textField: {
      width: "260px",
      margin: theme.spacing(1),
      marginLeft: theme.spacing(3),
    },
    dialogActions: { margin: theme.spacing(3), float: "right" },
  })
);

interface TableGridProps {
  data: object[];
  setData: React.Dispatch<React.SetStateAction<object[]>>;
  colDefs: ColDef[];
}

interface ActionButtonProps {
  endIcon?: string;
  color?: "inherit" | "default" | "primary" | "secondary" | undefined;
  onClick?: () => void;
  disabled?: boolean;
  text: string;
}

const gridOptions = {
  animateRows: true,
  undoRedoCellEditing: true,
  rowSelection: "multiple",
  defaultColDef: {
    editable: true,
    sortable: true,
    filter: true,
    resizable: true,
  },
};

const ActionButton = (props: ActionButtonProps) => {
  const { endIcon, color, onClick, disabled, text } = props;
  return (
    <Button
      variant="contained"
      color={color ? color : "primary"}
      endIcon={endIcon ? <Icon>{endIcon}</Icon> : <Icon>{text}</Icon>}
      disableElevation
      onClick={onClick}
      disabled={disabled}
      style={{ marginRight: 8, marginBottom: 8 }}
    >
      {text}
    </Button>
  );
};

export default function TableGrid(props: TableGridProps) {
  const classes = useStyles();
  const { data, setData, colDefs } = props;
  const [gridApi, setGridApi] = useState<GridApi>();
  const [addOpen, setAddOpen] = useState(false);
  const [delDisabled, setDelDisabled] = useState(true);

  function updateDelete() {
    if (gridApi?.getSelectedRows().length) setDelDisabled(false);
    else setDelDisabled(true);
  }

  function handleDelete() {
    if (gridApi?.getSelectedNodes().length)
      for (let node of gridApi.getSelectedNodes())
        data.splice(node.childIndex, 1);
    gridApi?.applyTransaction({
      remove: gridApi.getSelectedRows(),
    });
  }

  return (
    <React.Fragment>
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>添加新行</DialogTitle>
        <Alert severity="info" elevation={0}>
          新数据将被添加到原有行的末尾。
        </Alert>
        <Formik
          initialValues={Object.fromEntries(
            colDefs.map((colDef) => [colDef.field, ""])
          )}
          onSubmit={(values) => {
            gridApi?.applyTransaction({
              add: [values],
            });
            setData([...data, values]);
            setAddOpen(false);
          }}
        >
          {({ submitForm }) => (
            <Form>
              {colDefs.map((colDef) => (
                <Field
                  component={FormTextField}
                  name={colDef.field}
                  label={colDef.field}
                  variant="filled"
                  className={classes.textField}
                />
              ))}
              <div className={classes.dialogActions}>
                <Button onClick={() => setAddOpen(false)} size="large">
                  取消
                </Button>
                <Button size="large" color="primary" onClick={submitForm}>
                  提交
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>
      <Box className={classes.actions}>
        <ActionButton
          endIcon="add"
          text="添加新行"
          onClick={() => setAddOpen(true)}
        />
        <ActionButton
          color="secondary"
          text="撤销"
          endIcon="undo"
          onClick={() => gridApi?.undoCellEditing()}
        />
        <ActionButton
          text="重做"
          endIcon="redo"
          onClick={() => gridApi?.redoCellEditing()}
        />
        <ActionButton
          color="secondary"
          text="删除行"
          endIcon="delete"
          disabled={delDisabled}
          onClick={handleDelete}
        />
        <ActionButton
          endIcon="launch"
          text="导出"
          onClick={() => gridApi?.exportDataAsCsv()}
        />
        <TextField
          variant="outlined"
          size="small"
          placeholder="搜索任意关键字"
          InputProps={{
            classes: { input: classes.searchField },
            startAdornment: (
              <InputAdornment position="start">
                <Icon>search</Icon>
              </InputAdornment>
            ),
          }}
          onChange={(e) => gridApi?.setQuickFilter(e.target.value)}
        />
      </Box>
      <Paper className={`ag-theme-material ${classes.table}`} elevation={2}>
        <AgGridReact
          gridOptions={gridOptions}
          columnDefs={colDefs}
          rowData={data}
          onGridReady={(e) => setGridApi(e.api)}
          onSelectionChanged={updateDelete}
        />
      </Paper>
    </React.Fragment>
  );
}
