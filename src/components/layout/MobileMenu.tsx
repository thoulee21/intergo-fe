"use client";

import {
  CloseOutlined,
  LoginOutlined,
  MenuOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Dropdown, Menu, Space } from "antd";
import type { ItemType, MenuItemType } from "antd/es/menu/interface";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function MobileMenu({
  menuItems,
  isAuthenticated,
  userName,
  userMenuItems,
  loading,
}: {
  menuItems: ItemType<MenuItemType>[];
  isAuthenticated: boolean;
  userName: string;
  userMenuItems: ItemType<MenuItemType>[];
  loading?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <>
      <div className="mobile-menu">
        <Button
          icon={<MenuOutlined />}
          onClick={showDrawer}
          style={{ fontSize: "18px" }}
        />
      </div>

      <Drawer
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        width={280}
        closeIcon={<CloseOutlined />}
        styles={{ body: { padding: 0 } }}
        extra={
          <div style={{ padding: "16px", borderTop: "1px solid #f0f0f0" }}>
            {loading ? (
              <Button type="primary" icon={<UserOutlined />} loading={true}>
                加载中
              </Button>
            ) : isAuthenticated ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Button type="primary" icon={<UserOutlined />}>
                  {userName}
                </Button>
              </Dropdown>
            ) : (
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  block
                  type="primary"
                  icon={<LoginOutlined />}
                  onClick={() => {
                    router.push("/login");
                    closeDrawer();
                  }}
                >
                  登录
                </Button>
                <Button
                  block
                  icon={<UserAddOutlined />}
                  onClick={() => {
                    router.push("/register");
                    closeDrawer();
                  }}
                >
                  注册
                </Button>
              </Space>
            )}
          </div>
        }
      >
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          style={{
            height: "100%",
            borderRight: "none",
          }}
          items={menuItems}
        />
      </Drawer>
    </>
  );
}
