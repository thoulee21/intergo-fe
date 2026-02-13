import { authAPI } from "@/services/api";
import eventBus from "./eventBus";

export const syncAuthState = async (): Promise<boolean> => {
  try {
    const authenticated = await authAPI.isAuthenticated();

    if (authenticated) {
      const userInfo = await authAPI.validateSession();

      eventBus.publish("AUTH_STATE_CHANGED", {
        authenticated: true,
        username: userInfo.data.username,
        isAdmin: userInfo.data.is_admin,
        userType: userInfo.data.user_type,
      });

      return true;
    } else {
      eventBus.publish("AUTH_STATE_CHANGED", {
        authenticated: false,
      });

      return false;
    }
  } catch (error) {
    console.error("同步认证状态失败:", error);

    eventBus.publish("AUTH_STATE_CHANGED", {
      authenticated: false,
    });

    return false;
  }
};

const authSync = {
  syncAuthState,
};

export default authSync;
