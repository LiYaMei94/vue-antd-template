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
  FormItemRest,
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
  Avatar,
  Drawer,
  Textarea,
  Divider,
  Breadcrumb,
  BreadcrumbItem,
  PageHeader,
  RadioGroup,
  Radio,
  Popconfirm,
  Modal,
  Switch
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
  MenuUnfoldOutlined,
  CloseOutlined,
  EditOutlined,
  CheckOutlined,
  DeleteOutlined,
  DoubleRightOutlined,
  WindowsOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons-vue';

import CustomSubMenu from '@/components/SubMenu';
import CustomMenu from '@/components/Menu';
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
    app.component(Drawer.name, Drawer);
    app.component(Textarea.name, Textarea);
    app.component(Divider.name, Divider);
    app.component(Breadcrumb.name, Breadcrumb);
    app.component(BreadcrumbItem.name, BreadcrumbItem);
    app.component(PageHeader.name, PageHeader);
    app.component(RadioGroup.name, RadioGroup);
    app.component(Radio.name, Radio);
    app.component(Popconfirm.name, Popconfirm);
    app.component(Modal.name, Modal);
    app.component(Switch.name, Switch);
    app.component(FormItemRest.name, FormItemRest);

    // 图标，使用<SyncOutlined></SyncOutlined>或者<sync-outlined></sync-outlined>
    app.component(SyncOutlined.name, SyncOutlined);
    app.component(DownOutlined.name, DownOutlined);
    app.component(UpOutlined.name, UpOutlined);
    app.component(SettingOutlined.name, SettingOutlined);
    app.component(PieChartOutlined.name, PieChartOutlined);
    app.component(MailOutlined.name, MailOutlined);
    app.component(UserOutlined.name, UserOutlined);
    app.component(FullscreenOutlined.name, FullscreenOutlined);
    app.component(FullscreenExitOutlined.name, FullscreenExitOutlined);
    app.component(MenuFoldOutlined.name, MenuFoldOutlined);
    app.component(MenuUnfoldOutlined.name, MenuUnfoldOutlined);
    app.component(CloseOutlined.name, CloseOutlined);
    app.component(EditOutlined.name, EditOutlined);
    app.component(CheckOutlined.name, CheckOutlined);
    app.component(DeleteOutlined.name, DeleteOutlined);
    app.component(DoubleRightOutlined.name, DoubleRightOutlined);
    app.component(WindowsOutlined.name, WindowsOutlined);
    app.component(LeftOutlined.name, LeftOutlined);
    app.component(RightOutlined.name, RightOutlined);

    // 自定义组件
    app.component('CustomSubMenu', CustomSubMenu);
    app.component('CustomMenu', CustomMenu);
    app.component('MyIcon', MyIcon);
  }
};
