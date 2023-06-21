import {
  Button,
  message,
  ConfigProvider,
  Menu,
  SubMenu,
  MenuItem,
  MenuItemGroup,
  Layout,
  LayoutContent,
  LayoutSider,
  LayoutHeader,
  Form,
  FormItem,
  TabPane,
  Tabs,
  Input,
  Checkbox,
  Row,
  Col,
  InputNumber,
  InputPassword
} from 'ant-design-vue';

export default {
  install: (app, options) => {
    app.component(Button.name, Button);
    app.component(message.name, message);
    app.component(ConfigProvider.name, ConfigProvider);
    app.component(Menu.name, Menu);
    app.component(SubMenu.name, SubMenu);
    app.component(MenuItem.name, MenuItem);
    app.component(MenuItemGroup.name, MenuItemGroup);
    app.component(Layout.name, Layout);
    app.component(LayoutContent.name, LayoutContent);
    app.component(LayoutSider.name, LayoutSider);
    app.component(LayoutHeader.name, LayoutHeader);
    app.component(Form.name, Form);
    app.component(FormItem.name, FormItem);
    app.component(TabPane.name, TabPane);
    app.component(Tabs.name, Tabs);
    app.component(Input.name, Input);
    app.component(Checkbox.name, Checkbox);
    app.component(Row.name, Row);
    app.component(Col.name, Col);
    app.component(InputNumber.name, InputNumber);
    app.component(InputPassword.name, InputPassword);

    app.config.globalProperties.$message = message;
  }
};
