import usePermissionData from "../hooks/usePermissionData";

export const withPermission = (WrappedComponent, pageName, requiredAction) => {
  return function WithPermissionComponent(props) {
    const { hasPermission } = usePermissionData();

    if (hasPermission(pageName, requiredAction)) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
};
