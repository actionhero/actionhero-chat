import { shallow } from "enzyme";
import Index from "../../pages/index";

describe("components/footer", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Index content="# hello world" />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test("renders the page", () => {
    expect(wrapper.html()).toContain("hello world");
    expect(wrapper.html()).toContain("View project source on Github");
  });
});
