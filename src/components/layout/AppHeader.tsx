"use client";

import pkg from "@/../package.json";
import "@/app/app.css";
import MobileMenu from "@/components/layout/MobileMenu";
import { useSettings } from "@/hooks/useSettings";
import { authAPI } from "@/services/api";
import eventBus from "@/utils/eventBus";
import {
  ApartmentOutlined,
  BookOutlined,
  DashboardOutlined,
  HomeOutlined,
  LineChartOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { App, Avatar, Button, Dropdown, Layout, Menu, theme } from "antd";
import type { ItemType, MenuItemType } from "antd/es/menu/interface";
import isMobile from "is-mobile";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const { Header } = Layout;
const { useApp } = App;

const ClientAppHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { token } = theme.useToken();
  const { message: messageApi } = useApp();
  const { isDarkMode } = useSettings();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userType, setUserType] = useState<"candidate" | "recruiter">(
    "candidate",
  );
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true); 

      try {
        const userInfo = await authAPI.validateSession();
        const authenticated = userInfo?.data?.valid || false;
        setIsAuthenticated(authenticated);

        if (authenticated) {
          setIsAdmin(userInfo?.data?.is_admin || false);
          setUserType(userInfo?.data?.user_type || "candidate");
          setUserName(userInfo?.data?.username || "");
        }
      } catch (e) {
        console.error("获取用户认证状态失败:", e);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); 
      }
    };

    checkAuthStatus();

    const unsubscribe = eventBus.subscribe(
      "AUTH_STATE_CHANGED",
      async (data) => {
        if (data && data.authenticated !== undefined) {
          setLoading(true);

          setIsAuthenticated(data.authenticated);
          if (data.authenticated) {
            setIsAdmin(data.isAdmin || false);
            setUserType(data.userType || "candidate");
            setUserName(data.username || "");
          } else {
            setIsAdmin(false);
            setUserType("candidate");
            setUserName("");
          }

          setTimeout(() => setLoading(false), 300);
        } else {
          checkAuthStatus();
        }
      },
    );

    return () => unsubscribe();
  }, []);

  const handleLogout = useCallback(async () => {
    setLoading(true); 

    try {
      await authAPI.logout();

      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserType("candidate");
      setUserName("");
      messageApi.success("已成功退出登录");

      router.push("/");
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }, [messageApi, router]);

  const menuItems = useMemo(() => {
    const baseItems: ItemType<MenuItemType>[] = [
      {
        key: "/",
        icon: <HomeOutlined />,
        label: <Link href="/">首页</Link>,
      },
    ];

    baseItems.push({
      key: "/setup",
      icon: <SettingOutlined />,
      label: <Link href="/setup">开始面试</Link>,
    });

    // 招聘官菜单
    if (isAuthenticated && userType === "recruiter") {
      baseItems.push({
        key: "recruiter",
        icon: <TeamOutlined />,
        label: "招聘管理后台",
        children: [
          {
            key: "/recruiter",
            icon: <DashboardOutlined />,
            label: <Link href="/recruiter">仪表板</Link>,
          },
          {
            key: "/recruiter/candidates",
            icon: <TeamOutlined />,
            label: <Link href="/recruiter/candidates">受邀求职者</Link>,
          },
          {
            key: "/recruiter/presets",
            icon: <SettingOutlined />,
            label: <Link href="/recruiter/presets">面试预设</Link>,
          },
        ],
      });
    }

    // 管理员菜单
    if (isAdmin) {
      baseItems.push({
        key: "admin",
        icon: <DashboardOutlined />,
        label: "管理后台",
        children: [
          {
            key: "/admin/sessions",
            icon: <UserOutlined />,
            label: <Link href="/admin/sessions">面试会话管理</Link>,
          },
          {
            key: "/admin/position-types",
            icon: <ApartmentOutlined />,
            label: <Link href="/admin/position-types">职位类型管理</Link>,
          },
          {
            key: "/admin/users",
            icon: <TeamOutlined />,
            label: <Link href="/admin/users">用户管理</Link>,
          },
          {
            key: "/admin/learning-paths",
            icon: <BookOutlined />,
            label: <Link href="/admin/learning-paths">学习路径管理</Link>,
          },
          {
            key: "/admin/presets",
            icon: <SettingOutlined />,
            label: <Link href="/admin/presets">预设场景管理</Link>,
          },
        ],
      });
    }

    return baseItems;
  }, [isAuthenticated, isAdmin, userType]);

  // 用户下拉菜单选项
  const getUserMenuItems = useCallback(() => {
    const baseItems = [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: "个人资料",
        onClick: () => router.push("/profile"),
      },
    ];

    baseItems.push(
      {
        key: "learning-paths",
        icon: <BookOutlined />,
        label: "学习路径",
        onClick: () => router.push("/profile/learning-paths"),
      },
      {
        key: "progress",
        icon: <LineChartOutlined />,
        label: "进步分析",
        onClick: () => router.push("/profile/progress"),
      },
      {
        key: "settings",
        icon: <SettingOutlined />,
        label: "设置",
        onClick: () => router.push("/settings"),
      },
    );

    // 添加登出选项
    baseItems.push({
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      onClick: handleLogout,
    });

    return baseItems;
  }, [router, handleLogout]);

  const userMenuItems = getUserMenuItems();
  const isMobileView = useMemo(() => isMobile(), []);

  // 根据滚动状态和主题计算 Header 样式
  const getHeaderStyle = useMemo(() => {
    const baseStyle = {
      position: "fixed" as const,
      zIndex: 1000,
      width: "100%",
      height: "64px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 24px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      borderBottom: `1px solid ${isScrolled ? (isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)") : "transparent"}`,
    };

    if (isScrolled) {
      return {
        ...baseStyle,
        background: isDarkMode
          ? "rgba(20, 20, 20, 0.85)"
          : "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(24px) saturate(180%)",
        boxShadow: isDarkMode
          ? "0 4px 24px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(255, 255, 255, 0.05)"
          : "0 4px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
      };
    } else {
      return {
        ...baseStyle,
        background: isDarkMode
          ? "rgba(20, 20, 20, 0.65)"
          : "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(20px) saturate(160%)",
        boxShadow: isDarkMode
          ? "0 2px 16px rgba(255, 255, 255, 0.08)"
          : "0 2px 16px rgba(0, 0, 0, 0.08)",
      };
    }
  }, [isScrolled, isDarkMode]);

  return (
    <Header
      className={`site-header ${isScrolled ? "scrolled" : ""}`}
      style={getHeaderStyle}
    >
      <div
        className="logo"
        style={{
          display: "flex",
          alignItems: "center",
          transform: isScrolled ? "scale(0.95)" : "scale(1)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <Avatar
            size={isScrolled ? 32 : 36}
            icon={<TeamOutlined />}
            style={{
              background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
              color: "white",
              boxShadow: isScrolled
                ? "0 2px 12px rgba(0, 0, 0, 0.15)"
                : "0 4px 16px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              border: `2px solid ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"}`,
            }}
          />
          <span
            style={{
              margin: "0 0 0 12px",
              fontSize: isScrolled ? "18px" : "20px",
              color: isDarkMode ? "#ffffff" : token.colorPrimary,
              fontWeight: 700,
              textShadow: isDarkMode
                ? "0 1px 3px rgba(0, 0, 0, 0.3)"
                : "0 1px 3px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              backgroundImage: isDarkMode
                ? "none"
                : `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
              backgroundClip: isDarkMode ? "border-box" : "text",
              WebkitBackgroundClip: isDarkMode ? "border-box" : "text",
              WebkitTextFillColor: isDarkMode ? "#ffffff" : "transparent",
            }}
          >
            {pkg.displayName}
          </span>
        </Link>
        <span
          style={{
            marginLeft: 12,
            fontSize: isScrolled ? "13px" : "14px",
            color: isDarkMode
              ? "rgba(255, 255, 255, 0.7)"
              : token.colorTextSecondary,
            textShadow: isDarkMode
              ? "0 1px 2px rgba(0, 0, 0, 0.3)"
              : "0 1px 2px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: isScrolled ? 0.8 : 1,
          }}
        >
          智能模拟面试系统
        </span>
      </div>
      {!isMobileView ? (
        <div
          className="desktop-menu"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Menu
            theme={isDarkMode ? "dark" : "light"}
            mode="horizontal"
            selectedKeys={[pathname]}
            className="nav-menu"
            style={{
              background: "transparent",
              borderBottom: "none",
              minWidth: "550px",
              fontSize: isScrolled ? "14px" : "15px",
              transition: "font-size 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            items={menuItems}
          />

          {/* 用户头像和下拉菜单 */}
          <div style={{ marginLeft: 8 }}>
            {loading ? (
              <Button
                type="text"
                icon={
                  <Avatar
                    size={isScrolled ? 28 : 32}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                }
                loading={true}
                style={{
                  fontSize: isScrolled ? "13px" : "14px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                加载中
              </Button>
            ) : isAuthenticated ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Button
                  type="primary"
                  icon={<UserOutlined />}
                  style={{
                    boxShadow: isScrolled
                      ? "0 2px 12px rgba(0, 0, 0, 0.15)"
                      : "0 4px 16px rgba(0, 0, 0, 0.2)",
                    borderRadius: "8px",
                    height: isScrolled ? "36px" : "40px",
                    fontSize: isScrolled ? "13px" : "14px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
                    border: "none",
                  }}
                >
                  {userName}
                </Button>
              </Dropdown>
            ) : (
              <div style={{ display: "flex", gap: "12px" }}>
                <Button
                  type="text"
                  icon={<LoginOutlined />}
                  onClick={() => router.push("/login")}
                  style={{
                    boxShadow: isScrolled
                      ? "0 2px 12px rgba(0, 0, 0, 0.1)"
                      : "0 4px 16px rgba(0, 0, 0, 0.15)",
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                    height: isScrolled ? "36px" : "40px",
                    fontSize: isScrolled ? "13px" : "14px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    color: isDarkMode ? "#ffffff" : token.colorText,
                    border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.06)"}`,
                  }}
                >
                  登录
                </Button>
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={() => router.push("/register")}
                  style={{
                    boxShadow: isScrolled
                      ? "0 2px 12px rgba(0, 0, 0, 0.15)"
                      : "0 4px 16px rgba(0, 0, 0, 0.2)",
                    borderRadius: "8px",
                    height: isScrolled ? "36px" : "40px",
                    fontSize: isScrolled ? "13px" : "14px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
                    border: "none",
                  }}
                >
                  注册
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <MobileMenu
          isAuthenticated={isAuthenticated}
          menuItems={menuItems}
          userMenuItems={userMenuItems}
          userName={userName}
          loading={loading}
        />
      )}
    </Header>
  );
};

export default ClientAppHeader;
