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
  InputPassword,
  Table,
  TableColumn,
  Tag,
  Select,
  DatePicker,
  TimePicker,
  Cascader,
  TreeSelect,
  Pagination,
  Popover,
  Tooltip,
  Space,
  Dropdown,
  MenuDivider,
  Avatar
} from 'ant-design-vue';

import {
  SyncOutlined,
  DownOutlined,
  UpOutlined,
  SettingOutlined,
  PieChartOutlined,
  MailOutlined,
  UserOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons-vue';

import CustomSubMenu from '@/components/SubMenu';
import MyIcon from '@/components/Icon.vue';

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
    app.component(Table.name, Table);
    app.component(TableColumn.name, TableColumn);
    app.component(Tag.name, Tag);
    app.component(Select.name, Select);
    app.component(DatePicker.name, DatePicker);
    app.component(TimePicker.name, TimePicker);
    app.component(Cascader.name, Cascader);
    app.component(TreeSelect.name, TreeSelect);
    app.component(Pagination.name, Pagination);
    app.component(Popover.name, Popover);
    app.component(Tooltip.name, Tooltip);
    app.component(Space.name, Space);
    app.component(Dropdown.name, Dropdown);
    app.component(MenuDivider.name, MenuDivider);
    app.component(Avatar.name, Avatar);

    // 图标
    app.component('SyncOutlined', SyncOutlined);
    app.component('DownOutlined', DownOutlined);
    app.component('UpOutlined', UpOutlined);
    app.component('SettingOutlined', SettingOutlined);
    app.component('PieChartOutlined', PieChartOutlined);
    app.component('MailOutlined', MailOutlined);
    app.component('UserOutlined', UserOutlined);
    app.component('FullscreenOutlined', FullscreenOutlined);
    app.component('FullscreenExitOutlined', FullscreenExitOutlined);
    app.component('MenuFoldOutlined', MenuFoldOutlined);
    app.component('MenuUnfoldOutlined', MenuUnfoldOutlined);

    // 自定义组件
    app.component('CustomSubMenu', CustomSubMenu);
    app.component('MyIcon', MyIcon);

    app.config.globalProperties.$message = message;
  }
};
