import { mount, RouterLinkStub } from "@vue/test-utils";
import ArticleHeader from "@/components/ArticleHeader.vue";
import BaseTag from "@/components/BaseTag.vue";
import { ARTICLE_TYPES } from "@/constants";

describe("ArticleHeader", () => {
  const defaultProps = {
    title: "Understanding Elasticsearch",
    subTitle: "A deep dive into search engines",
    articleTags: ["elasticsearch", "search"],
    articleType: ARTICLE_TYPES.BLOG,
    coverImage: "cover.png",
    creationDate: "January 2024",
    readingTime: "10",
    markdownContent: "# Article content here",
  };

  let showToast;

  const factory = (props = {}, options = {}) => {
    showToast = vi.fn();
    return mount(ArticleHeader, {
      props: { ...defaultProps, ...props },
      global: {
        provide: { showToast },
        stubs: {
          RouterLink: RouterLinkStub,
          InlineButton: true,
        },
        mocks: {
          $router: { push: vi.fn() },
        },
        ...options.global,
      },
    });
  };

  beforeEach(() => {
    vi.stubGlobal("open", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the title and subtitle", () => {
    const wrapper = factory();
    expect(wrapper.find(".article-header-title").text()).toBe("Understanding Elasticsearch");
    expect(wrapper.find(".article-header-subtitle").text()).toBe("A deep dive into search engines");
  });

  it("renders all article tags", () => {
    const wrapper = factory();
    const tags = wrapper.findAllComponents(BaseTag);
    expect(tags).toHaveLength(2);
    tags.forEach((tag, index) => {
      expect(tag.props("name")).toBe(defaultProps.articleTags[index]);
    });
  });

  it("renders cover image with correct src", () => {
    const wrapper = factory({ coverImage: "my-cover.jpg" });
    expect(wrapper.find(".article-header-cover-image").attributes("src")).toBe("my-cover.jpg");
  });

  it("displays creation date and reading time", () => {
    const wrapper = factory({ creationDate: "March 2024", readingTime: "5" });
    expect(wrapper.find(".article-header-meta-info").text()).toContain("March 2024");
    expect(wrapper.find(".article-header-meta-info").text()).toContain("5 min read");
  });

  it("opens Twitter share dialog when share button is clicked", async () => {
    const wrapper = factory();
    const twitterButton = wrapper.findAll(".article-header-share-button")[0];
    await twitterButton.trigger("click");
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining("twitter.com/intent/tweet"), "_blank");
  });

  it("opens LinkedIn share dialog when share button is clicked", async () => {
    const wrapper = factory();
    const linkedInButton = wrapper.findAll(".article-header-share-button")[1];
    await linkedInButton.trigger("click");
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining("linkedin.com/sharing"), "_blank");
  });

  it("emits show-toast with success when link is copied", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const wrapper = factory();
    const copyButton = wrapper.findAll(".article-header-share-button")[2];
    await copyButton.trigger("click");
    await wrapper.vm.$nextTick();

    expect(writeText).toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith({
      message: "Link copied to clipboard!",
      type: "success",
    });
  });

  it("emits show-toast with error when copy link fails", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Copy failed"));
    Object.assign(navigator, { clipboard: { writeText } });

    const wrapper = factory();
    const copyButton = wrapper.findAll(".article-header-share-button")[2];
    await copyButton.trigger("click");
    await wrapper.vm.$nextTick();

    expect(showToast).toHaveBeenCalledWith({
      message: "Failed to copy link",
      type: "error",
    });
  });

  it("emits show-toast with success when markdown content is copied", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const wrapper = factory();
    await wrapper.vm.handleCopyContentInMarkdown();
    await wrapper.vm.$nextTick();

    expect(writeText).toHaveBeenCalledWith(defaultProps.markdownContent);
    expect(showToast).toHaveBeenCalledWith({
      message: "Article content copied to clipboard!",
      type: "success",
    });
  });

  it("emits show-toast with error when copying markdown content fails", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Copy failed"));
    Object.assign(navigator, { clipboard: { writeText } });

    const wrapper = factory();
    await wrapper.vm.handleCopyContentInMarkdown();
    await wrapper.vm.$nextTick();

    expect(showToast).toHaveBeenCalledWith({
      message: "Failed to copy article content",
      type: "error",
    });
  });
});
