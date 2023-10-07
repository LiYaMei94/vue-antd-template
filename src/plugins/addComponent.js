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
  RangePicker,
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
  Switch,
  CheckboxGroup,
  Tree,
  Upload,
  UploadDragger,
  Progress,
  InputSearch
} from 'ant-design-vue';

import * as AntIcons from '@ant-design/icons-vue';

import CustomSubMenu from '@/components/SubMenu';
import CustomMenu from '@/components/Menu';
import IconFont from '@/components/Icon/IconFont';
import IconSvg from '@/components/Icon/IconSvg';
import * as ActionButtons from '@/components/ActionButtons';
import ProTable from '@/components/ProTable';

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
    app.component(RangePicker.name, RangePicker);
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
    app.component(CheckboxGroup.name, CheckboxGroup);
    app.component(Tree.name, Tree);
    app.component(Upload.name, Upload);
    app.component(UploadDragger.name, UploadDragger);
    app.component(Progress.name, Progress);
    app.component(InputSearch.name, InputSearch);

    // 图标，使用<SyncOutlined></SyncOutlined>或者<sync-outlined></sync-outlined>
    for (const i in AntIcons) {
      app.component(AntIcons[i].name, AntIcons[i]);
    }

    // 自定义组件
    app.component('CustomSubMenu', CustomSubMenu);
    app.component('CustomMenu', CustomMenu);
    app.component('IconFont', IconFont); // 字体图标，支持@ant-design/icons-vue和阿里巴巴矢量库
    app.component('IconSvg', IconSvg);
    for (const i in ActionButtons) {
      app.component(ActionButtons[i].name, ActionButtons[i]);
    }
    app.component('ProTable', ProTable);
  }
};
