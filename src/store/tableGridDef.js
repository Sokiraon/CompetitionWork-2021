export const headers = [
  'ORDER', 'SEMI_PRODUCT', 'PROCESS', 'RESOURCE', 'PROCESS_RESOURCE'
];

export const columnDefs = [[
  { field: 'order_id', checkboxSelection: true, headerCheckboxSelection: true }, 
  { field: 'description' }, 
  { field: 'product_id' },
  { field: 'product_amount' },
  { field: 'earliest_start_time' },
  { field: 'latest_end_time' },
], [
  { field: 'product_id', checkboxSelection: true, headerCheckboxSelection: true },
  { field: 'semi_product_id' },
], [
  { field: 'semi_product_id', checkboxSelection: true, headerCheckboxSelection: true },
  { field: 'semi_product_field' },
  { field: 'part_id' },
  { field: 'part_field' },
  { field: 'prev_part_id' },
  { field: 'input_semi_finished_product_id' },
  { field: 'input_semi_finished_prodcut_amount' },
  { field: 'output_semi_finished_product_id' },
  { field: 'production_mode' },
  { field: 'production_time' },
  { field: 'minimum_production_quantity' },
  { field: 'maximum_production_quantity' },
  { field: 'workspace' },
], [
  { field: 'resource_id', checkboxSelection: true, headerCheckboxSelection: true },
  { field: 'field' },
  { field: 'resource_type' },
  { field: 'amount' },
  { field: 'resource_attributes' },
  { field: 'basic_attribute' },
  { field: 'workspace' },
], [
  { field: 'part_id', checkboxSelection: true, headerCheckboxSelection: true },
  { field: 'field' },
  { field: 'resource_attributes' },
  { field: 'amount' },
]];

export const gridOptions = {
  animateRows: true,
  undoRedoCellEditing: true,
  rowSelection: 'multiple',
  defaultColDef: {
    editable: true,
    sortable: true,
    filter: true,
    resizable: true,
  }
}