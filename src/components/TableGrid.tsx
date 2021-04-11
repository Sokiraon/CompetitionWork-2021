import {
  Box,
  Button,
  createStyles,
  Dialog,
  DialogActions,
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
import { FilePond } from "react-filepond";
import { FilePondFile } from "filepond";
import Papa from "papaparse";
import { gridOptions } from "../store/tableGridDef";

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
    filepond: { width: "500px", marginTop: theme.spacing(0.5) },
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
  const [delDisabled, setDelDisabled] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const updateFiles = (newFiles: FilePondFile[]) =>
    setFiles(newFiles.map((fileItem) => fileItem.file));

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

  function importData() {
    for (let file of files) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        encoding: "utf-8",
        complete: (res) => {
          let newData = res.data as object[];
          setData([...data, ...newData]);
        },
      });
    }
    setImportOpen(false);
  }

  return (
    <React.Fragment>
      <Dialog open={importOpen} onClose={() => setImportOpen(false)}>
        <DialogTitle>批量添加</DialogTitle>
        <Alert severity="warning" elevation={0}>
          只接受订单文件，最多5个。
        </Alert>
        <FilePond
          files={files}
          onupdatefiles={updateFiles}
          allowMultiple={true}
          maxFiles={5}
          className={classes.filepond}
          labelIdle='拖放到此处 或 <span class="filepond--label-action">手动选择</span>'
        />
        <DialogActions>
          <Button onClick={() => setImportOpen(false)}>取消</Button>
          <Button onClick={() => importData()} color="primary">
            导入
          </Button>
        </DialogActions>
      </Dialog>

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
          endIcon="folder_open"
          text="批量添加"
          color="default"
          onClick={() => setImportOpen(true)}
        />
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
      <Paper className={`ag-theme-material ${classes.table}`}>
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
