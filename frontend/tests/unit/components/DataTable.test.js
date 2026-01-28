import { mount } from "@vue/test-utils";
import DataTable from "@/components/Table.vue";

describe("DataTable", () => {
  const headers = ["Name", "Age", "City"];
  const rows = [
    ["Alice", "25", "New York"],
    ["Bob", "30", "Los Angeles"],
    ["Charlie", "35", "Chicago"],
  ];

  it("renders table with headers and rows", () => {
    const wrapper = mount(DataTable, { props: { headers, rows } });

    expect(wrapper.find(".table-container").exists()).toBe(true);
    expect(wrapper.find("table.custom-table").exists()).toBe(true);
    expect(wrapper.find("thead").exists()).toBe(true);
    expect(wrapper.find("tbody").exists()).toBe(true);
  });

  it("renders correct number of header columns", () => {
    const wrapper = mount(DataTable, { props: { headers, rows } });
    const headerCells = wrapper.findAll("thead th");

    expect(headerCells).toHaveLength(3);
    expect(headerCells[0].text()).toBe("Name");
    expect(headerCells[1].text()).toBe("Age");
    expect(headerCells[2].text()).toBe("City");
  });

  it("renders correct number of rows and cells", () => {
    const wrapper = mount(DataTable, { props: { headers, rows } });
    const tableRows = wrapper.findAll("tbody tr");

    expect(tableRows).toHaveLength(3);

    const firstRowCells = tableRows[0].findAll("td");
    expect(firstRowCells).toHaveLength(3);
    expect(firstRowCells[0].text()).toBe("Alice");
    expect(firstRowCells[1].text()).toBe("25");
    expect(firstRowCells[2].text()).toBe("New York");
  });

  it("renders all row data correctly", () => {
    const wrapper = mount(DataTable, { props: { headers, rows } });
    const tableRows = wrapper.findAll("tbody tr");

    rows.forEach((row, rowIndex) => {
      const cells = tableRows[rowIndex].findAll("td");
      row.forEach((cell, cellIndex) => {
        expect(cells[cellIndex].text()).toBe(cell);
      });
    });
  });

  it("handles empty rows array", () => {
    const wrapper = mount(DataTable, { props: { headers, rows: [] } });
    const tableRows = wrapper.findAll("tbody tr");

    expect(tableRows).toHaveLength(0);
    expect(wrapper.findAll("thead th")).toHaveLength(3);
  });

  it("applies correct CSS classes", () => {
    const wrapper = mount(DataTable, { props: { headers, rows } });

    expect(wrapper.find(".table-container").exists()).toBe(true);
    expect(wrapper.find(".custom-table").exists()).toBe(true);
  });

  it("warns when headers prop is missing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mount(DataTable, { props: { rows } });
    expect(warn).toHaveBeenCalled();
    const warningMessage = warn.mock.calls.flat().join(" ");
    expect(warningMessage).toContain('Missing required prop: "headers"');
    warn.mockRestore();
  });

  it("warns when rows prop is missing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mount(DataTable, { props: { headers } });
    expect(warn).toHaveBeenCalled();
    const warningMessage = warn.mock.calls.flat().join(" ");
    expect(warningMessage).toContain('Missing required prop: "rows"');
    warn.mockRestore();
  });

  it("maintains table structure with uneven cell counts", () => {
    const unevenRows = [["Alice", "25"], ["Bob", "30", "Los Angeles", "Extra"], ["Charlie"]];
    const wrapper = mount(DataTable, { props: { headers, rows: unevenRows } });
    const tableRows = wrapper.findAll("tbody tr");

    expect(tableRows).toHaveLength(3);
    expect(tableRows[0].findAll("td")).toHaveLength(2);
    expect(tableRows[1].findAll("td")).toHaveLength(4);
    expect(tableRows[2].findAll("td")).toHaveLength(1);
  });

  it("applies default text alignment (left)", () => {
    const wrapper = mount(DataTable, { props: { headers, rows } });
    const table = wrapper.find(".custom-table");
    expect(table.element.style.textAlign).toBe("left");
  });

  it('applies "center" text alignment when prop is set', () => {
    const wrapper = mount(DataTable, { props: { headers, rows, textAlign: "center" } });
    const table = wrapper.find(".custom-table");
    expect(table.element.style.textAlign).toBe("center");
  });

  it('applies "right" text alignment when prop is set', () => {
    const wrapper = mount(DataTable, { props: { headers, rows, textAlign: "right" } });
    const table = wrapper.find(".custom-table");
    expect(table.element.style.textAlign).toBe("right");
  });

  it("warns for invalid textAlign prop value", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mount(DataTable, { props: { headers, rows, textAlign: "invalid" } });
    expect(warn).toHaveBeenCalled();
    const warningMessage = warn.mock.calls.flat().join(" ");
    expect(warningMessage).toContain("Invalid prop: custom validator check failed for prop");
    warn.mockRestore();
  });
});
