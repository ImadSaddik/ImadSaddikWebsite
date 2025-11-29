import { mount } from "@vue/test-utils";
import EditArticleOnGitHub from "@/components/EditArticleOnGitHub.vue";

describe("EditArticleOnGitHub", () => {
  const factory = (props = {}) =>
    mount(EditArticleOnGitHub, {
      props: {
        slug: "my-awesome-article",
        articleType: "blog-post",
        ...props,
      },
    });

  it("renders the edit link with correct URL for blogs", () => {
    const wrapper = factory({ slug: "blog_name" });
    const link = wrapper.find("a");
    expect(link.attributes("href")).toBe(
      "https://github.com/ImadSaddik/ImadSaddikWebsite/edit/master/frontend/src/blogs/blog_name/index.vue"
    );
  });

  it("renders the edit link with correct URL for courses", () => {
    const wrapper = factory({ slug: "course_name", articleType: "course-post" });
    const link = wrapper.find("a");
    expect(link.attributes("href")).toBe(
      "https://github.com/ImadSaddik/ImadSaddikWebsite/edit/master/frontend/src/courses/course_name/index.vue"
    );
  });

  it("renders the edit link with correct URL for astronomy", () => {
    const wrapper = factory({ slug: "astronomy_name", articleType: "astronomy-post" });
    const link = wrapper.find("a");
    expect(link.attributes("href")).toBe(
      "https://github.com/ImadSaddik/ImadSaddikWebsite/edit/master/frontend/src/astronomy/astronomy_name/index.vue"
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
