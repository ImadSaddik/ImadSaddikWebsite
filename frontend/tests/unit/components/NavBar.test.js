import { mount, RouterLinkStub } from "@vue/test-utils";
import NavBar from "@/components/NavBar.vue";

import { PAGE_KEYS } from "@/constants";

describe("NavBar", () => {
  const factory = (props = {}) =>
    mount(NavBar, {
      props: {
        visitedPage: "",
        ...props,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

  it("renders the home link with site name", () => {
    const wrapper = factory();
    const homeLink = wrapper.find(".nav-bar-home");
    expect(homeLink.text()).toBe("Imad Saddik");
    const homeLinkComponent = homeLink.findComponent(RouterLinkStub);
    expect(homeLinkComponent.props("to")).toBe("/");
  });

  it("renders all navigation items", () => {
    const wrapper = factory();
    const navItems = wrapper.findAll(".expanded-nav-bar-item");
    const expectedNames = ["Blogs", "Courses", "Astronomy", "About me", "Hire me"];
    expect(navItems).toHaveLength(5);
    navItems.forEach((item, index) => {
      expect(item.text()).toBe(expectedNames[index]);
    });
  });

  it("renders the correct navigation links", () => {
    const wrapper = factory();
    const navItems = wrapper.findAll(".expanded-nav-bar-item");
    const expectedLinks = ["/blogs", "/courses", "/astronomy", "/about-me", "/hire-me"];
    navItems.forEach((item, index) => {
      const linkComponent = item.findComponent(RouterLinkStub);
      expect(linkComponent.props("to")).toBe(expectedLinks[index]);
    });
  });

  it("applies selected class to the visited page item", async () => {
    const wrapper = factory({ visitedPage: PAGE_KEYS.BLOGS });
    await wrapper.vm.$nextTick();
    const blogsItem = wrapper.findAll(".expanded-nav-bar-item")[0];
    expect(blogsItem.classes()).toContain("selected");
  });

  it("toggles the collapsed menu when the menu button is clicked", async () => {
    const wrapper = factory();
    expect(wrapper.find(".collapsed-nav-bar").exists()).toBe(false);

    await wrapper.find(".nav-menu").trigger("click");
    expect(wrapper.find(".collapsed-nav-bar").exists()).toBe(true);

    await wrapper.find(".nav-menu").trigger("click");
    expect(wrapper.find(".collapsed-nav-bar").exists()).toBe(false);
  });

  it("closes the collapsed menu when a nav item is clicked", async () => {
    const wrapper = factory();
    await wrapper.find(".nav-menu").trigger("click");
    expect(wrapper.find(".collapsed-nav-bar").exists()).toBe(true);

    await wrapper.find(".collapsed-nav-bar-item").trigger("click");
    expect(wrapper.find(".collapsed-nav-bar").exists()).toBe(false);
  });
});
