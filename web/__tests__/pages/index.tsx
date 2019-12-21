import { shallow } from "enzyme";
import Index from "../../pages/index";

describe("components/footer", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Index />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test("renders the page", () => {
    expect(wrapper.html()).toContain("Hello World");
  });
});
