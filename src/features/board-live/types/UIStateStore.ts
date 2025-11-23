export default interface UISateStore {
    bottomBarCollapsed: boolean;
    bottomBarHeight: number;
    setBottomBarCollapsed: (value: boolean) => void;
    setBottomBarHeight: (value: number) => void;
}