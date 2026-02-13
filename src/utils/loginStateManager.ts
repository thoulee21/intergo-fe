import { clearCache } from "@/services/advanced-axios";
import { authAPI } from "@/services/api";
import eventBus from "./eventBus";

class LoginStateManager {
  private static instance: LoginStateManager;
  private currentUser: any = null;
  private isAuthenticated: boolean = false;
  private isAdmin: boolean = false;

  public static getInstance(): LoginStateManager {
    if (!LoginStateManager.instance) {
      LoginStateManager.instance = new LoginStateManager();
    }
    return LoginStateManager.instance;
  }

  private constructor() {
    eventBus.subscribe("AUTH_STATE_CHANGED", (data) => {
      if (data && data.source === "loginStateManager") {
        return;
      }

      if (data && data.authenticated !== undefined) {
        this.updateStateWithoutNotification(data);
      }
    });

    this.refreshLoginState();
  }

  private updateStateWithoutNotification(data: any): void {
    this.isAuthenticated = data.authenticated;
    if (data.authenticated) {
      this.isAdmin = data.isAdmin || false;
      this.currentUser = {
        username: data.username || "",
        isAdmin: data.isAdmin || false,
      };
    } else {
      this.currentUser = null;
      this.isAdmin = false;
    }
  }

  public async refreshLoginState(): Promise<boolean> {
    if (typeof window === "undefined") return false;

    try {
      clearCache(/\/auth\/validate-session/);

      const authenticated = await authAPI.isAuthenticated();
      this.isAuthenticated = authenticated;

      if (authenticated) {
        const userInfo = await authAPI.validateSession(false); 
        if (userInfo && userInfo.data) {
          this.currentUser = userInfo.data;
          this.isAdmin = userInfo.data.is_admin || false;
        }
      } else {
        this.currentUser = null;
        this.isAdmin = false;
      }

      this.notifyStateChange();
      return this.isAuthenticated;
    } catch (error) {
      console.error("刷新登录状态失败:", error);
      this.isAuthenticated = false;
      this.currentUser = null;
      this.isAdmin = false;
      this.notifyStateChange();
      return false;
    }
  }

  private notifyStateChange(): void {
    eventBus.publish("AUTH_STATE_CHANGED", {
      authenticated: this.isAuthenticated,
      isAdmin: this.isAdmin,
      userType: this.currentUser ? this.currentUser.user_type : "candidate",
      username: this.currentUser ? this.currentUser.username : null,
      source: "loginStateManager", 
    });
  }

  public getCurrentUser(): any {
    return this.currentUser;
  }

  public isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  public isUserAdmin(): boolean {
    return this.isAdmin;
  }
}

export const loginStateManager = LoginStateManager.getInstance();
export default loginStateManager;
