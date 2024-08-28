import { debounce, isString } from "lodash";
import { router } from "@inertiajs/react";
import { TableCellType } from "@narsil-table/Components/Table/TableCellRenderer";
import * as React from "react";
import createDataTableStore from "@narsil-table/Stores/dataTableStore";

import {
	CellContext,
	ColumnDef,
	ColumnFiltersState,
	ColumnOrderState,
	ColumnSizingState,
	ExpandedState,
	getCoreRowModel,
	GroupingState,
	PaginationState,
	RowSelectionState,
	SortingState,
	TableOptions,
	Updater,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import DataTableRowSelect from "./DataTableRowSelect";

declare module "@tanstack/table-core" {
	interface ColumnMeta<TData, TValue> {
		formatString: string;
		type: TableCellType;
	}

	interface TableMeta<TData> {
		setColumnOperators: (value: []) => void;
		setQuickFilters: (value: []) => void;
	}

	interface TableState {
		columnOperators?: any[];
		quickFilters?: any[];
	}
}

export interface createDataTableProps extends Partial<TableOptions<any>> {
	columns: ColumnDef<any, any>[];
	id: string;
	menu?: (props: CellContext<any, any>) => any;
}

const useDataTable = ({ columns, data, enableRowSelection = true, id, menu, ...props }: createDataTableProps) => {
	if (menu) {
		columns = [
			...(enableRowSelection
				? [
						{
							id: "_select",
							enableHiding: false,
							enableResizing: false,
							enableSorting: false,
							cell: (props: CellContext<any, any>) => <DataTableRowSelect row={props.row} />,
						},
					]
				: []),
			...columns,
			{
				id: "_menu",
				enableHiding: false,
				enableResizing: false,
				enableSorting: false,
				cell: menu,
			},
		];
	}

	function getColumnOrder() {
		const columnOrder = columns.reduce((array: string[], column) => {
			if (!isString(column.id) || array.includes(column.id)) {
				return array;
			}

			return array.concat(column.id);
		}, []);

		return columnOrder;
	}

	const useTableStore = React.useMemo(
		() =>
			createDataTableStore({
				id: id,
				initialState: {
					columnOrder: getColumnOrder(),
					pageSize: 10,
				},
			}),
		[id]
	);

	const tableStore = useTableStore((state) => state);

	const handleColumnFiltersChange = (
		filters: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)
	) => {
		tableStore.setColumnFilters(typeof filters === "function" ? filters(tableStore.columnFilters) : filters);
	};

	const handleColumnOrderChange = (order: ColumnOrderState | ((old: ColumnOrderState) => ColumnOrderState)) => {
		tableStore.setColumnOrder(typeof order === "function" ? order(tableStore.columnOrder) : order);
	};

	const handleColumnSizingChange = (sizing: ColumnSizingState | ((old: ColumnSizingState) => ColumnSizingState)) => {
		tableStore.setColumnSizing(typeof sizing === "function" ? sizing(tableStore.columnSizing) : sizing);
	};

	const handleColumnVisibilityChange = (
		visibility: VisibilityState | ((old: VisibilityState) => VisibilityState)
	) => {
		tableStore.setColumnVisibility(
			typeof visibility === "function" ? visibility(tableStore.columnVisibility) : visibility
		);
	};

	const handleExpandedChange = (expanded: ExpandedState | ((old: ExpandedState) => ExpandedState)) => {
		tableStore.setExpanded(typeof expanded === "function" ? expanded(tableStore.expanded) : expanded);
	};

	const handleGroupingChange = (grouping: GroupingState | ((old: GroupingState) => GroupingState)) => {
		tableStore.setGrouping(typeof grouping === "function" ? grouping(tableStore.grouping) : grouping);
	};

	const handlePaginationChange = (pagination: PaginationState | ((old: PaginationState) => PaginationState)) => {
		tableStore.setPagination(
			typeof pagination === "function"
				? pagination({
						pageIndex: tableStore.pageIndex,
						pageSize: tableStore.pageSize,
					})
				: pagination
		);
	};

	const handleRowSelectionChange = (rowSelection: Updater<RowSelectionState> | RowSelectionState) => {
		tableStore.setRowSelection(
			typeof rowSelection === "function" ? rowSelection(tableStore.rowSelection) : rowSelection
		);
	};

	const handleSortingChange = (sorting: Updater<SortingState> | SortingState) => {
		tableStore.setSorting(typeof sorting === "function" ? sorting(tableStore.sorting) : sorting);
	};

	const table = useReactTable({
		columnResizeMode: "onEnd",
		columns: columns,
		data: data as any[],
		defaultColumn: {
			minSize: 100,
			filterFn: () => {
				return true;
			},
		},
		enableRowSelection: enableRowSelection,
		groupedColumnMode: false,
		manualFiltering: true,
		manualGrouping: true,
		manualPagination: true,
		manualSorting: true,
		state: {
			columnFilters: tableStore.columnFilters,
			columnOperators: tableStore.columnOperators,
			columnOrder: tableStore.columnOrder,
			columnSizing: tableStore.columnSizing,
			columnVisibility: tableStore.columnVisibility,
			expanded: tableStore.expanded,
			globalFilter: tableStore.globalFilter,
			grouping: tableStore.grouping,
			pagination: {
				pageIndex: 0,
				pageSize: tableStore.pageSize,
			},
			rowSelection: tableStore.rowSelection,
			sorting: tableStore.sorting,
			quickFilters: tableStore.quickFilters,
		},
		getCoreRowModel: getCoreRowModel(),
		getRowId: (row) => row.id,
		onColumnFiltersChange: handleColumnFiltersChange,
		onColumnOrderChange: handleColumnOrderChange,
		onColumnSizingChange: handleColumnSizingChange,
		onColumnVisibilityChange: handleColumnVisibilityChange,
		onExpandedChange: handleExpandedChange,
		onGlobalFilterChange: tableStore.setGlobalFilter,
		onGroupingChange: handleGroupingChange,
		onPaginationChange: handlePaginationChange,
		onRowSelectionChange: handleRowSelectionChange,
		onSortingChange: handleSortingChange,
		...props,
	});

	const filter = React.useCallback(
		debounce((href, params) => {
			router.get(href, params, {
				preserveState: true,
			});
		}, 300),
		[]
	);

	React.useEffect(() => {
		const href = window.location.href.replace(location.search, "");

		filter(href, tableStore.getParams());

		return () => filter.cancel();
	}, [
		tableStore.filteredColumnFilters,
		tableStore.globalFilter,
		tableStore.grouping,
		tableStore.pageSize,
		tableStore.sorting,
	]);

	return { table, tableStore };
};

export default useDataTable;
