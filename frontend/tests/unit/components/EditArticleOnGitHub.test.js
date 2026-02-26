import { mount } from "@vue/test-utils";
import EditArticleOnGitHub from "@/components/EditArticleOnGitHub.vue";
import { ARTICLE_TYPES, DIRECTORY_MAPPING } from "@/constants";

describe("EditArticleOnGitHub", () => {
  const factory = (props = {}) =>
    mount(EditArticleOnGitHub, {
      props: {
        slug: "my-awesome-article",
        articleType: ARTICLE_TYPES.BLOG,
        ...props,
      },
    });

  it("renders the edit link with correct URL for blogs", () => {
    const wrapper = factory({ slug: "blog_name" });
    const link = wrapper.find("a");
    const directory = DIRECTORY_MAPPING[ARTICLE_TYPES.BLOG];
    expect(link.attributes("href")).toBe(
      `https://github.com/ImadSaddik/ImadSaddikWebsite/edit/master/frontend/src/${directory}/blog_name/content.md`
    );
  });

  it("renders the edit link with correct URL for courses", () => {
    const wrapper = factory({ slug: "course_name", articleType: ARTICLE_TYPES.COURSE });
    const link = wrapper.find("a");
    const directory = DIRECTORY_MAPPING[ARTICLE_TYPES.COURSE];
    expect(link.attributes("href")).toBe(
      `https://github.com/ImadSaddik/ImadSaddikWebsite/edit/master/frontend/src/${directory}/course_name/content.md`
    );
  });

  it("renders the edit link with correct URL for astronomy", () => {
    const wrapper = factory({ slug: "astronomy_name", articleType: ARTICLE_TYPES.ASTRONOMY });
    const link = wrapper.find("a");
    const directory = DIRECTORY_MAPPING[ARTICLE_TYPES.ASTRONOMY];
    expect(link.attributes("href")).toBe(
      `https://github.com/ImadSaddik/ImadSaddikWebsite/edit/master/frontend/src/${directory}/astronomy_name/content.md`
    );
  });

  it("opens the link in a new tab", () => {
    const wrapper = factory();
    const link = wrapper.find("a");
    expect(link.attributes("target")).toBe("_blank");
    expect(link.attributes("rel")).toBe("noopener noreferrer");
  });

  it("displays the edit icon and text", () => {
    const wrapper = factory();
    expect(wrapper.find("i.fa-edit").exists()).toBe(true);
    expect(wrapper.text()).toContain("Edit this page on GitHub");
  });
});
