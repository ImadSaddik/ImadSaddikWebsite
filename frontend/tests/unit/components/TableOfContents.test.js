import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import TableOfContents from "@/components/TableOfContents.vue";

describe("TableOfContents", () => {
  const headingsMarkup = `
    <div>
      <h2 id="introduction" data-table-of-contents>Introduction</h2>
      <h3 id="details" data-table-of-contents>Deep dive</h3>
    </div>
  `;

  let originalScrollTo;

  beforeEach(() => {
    document.body.innerHTML = headingsMarkup;
    originalScrollTo = window.scrollTo;
  });

  afterEach(() => {
    document.body.innerHTML = "";
    window.scrollTo = originalScrollTo;
    vi.restoreAllMocks();
  });

  it("collects headings into sections on mount", async () => {
    vi.spyOn(TableOfContents.methods, "computeAbsoluteYPosition").mockImplementation((element) => {
      return element.id === "introduction" ? 120 : 240;
    });

    const wrapper = mount(TableOfContents);
    await nextTick();
    await nextTick();

    expect(wrapper.vm.sections).toEqual([
      { id: "introduction", text: "Introduction", level: 2, y: 120 },
      { id: "details", text: "Deep dive", level: 3, y: 240 },
    ]);
    expect(wrapper.find("aside").exists()).toBe(true);
  });

  it("scrolls to the section and updates the URL hash when a link is clicked", async () => {
    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;
    const replaceStateSpy = vi.spyOn(window.history, "replaceState");

    vi.spyOn(TableOfContents.methods, "computeAbsoluteYPosition").mockImplementation(() => 400);

    const wrapper = mount(TableOfContents);
    await nextTick();

    await wrapper.vm.handleSectionClick("details");

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 400, behavior: "smooth" });
    expect(wrapper.vm.activeSectionId).toBe("details");
    expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "#details");
  });
});
