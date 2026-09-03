import { FunctionComponent, useMemo } from 'react';
import { Location, RouteObject, Link } from 'react-router-dom';
import { Breadcrumb as BaseBreadcrumb } from 'antd';
import { generateBreadcrumbs } from 'src/screens/utils/generateBreadcrumbs';
import { useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';

type BreadcrumbProps = {
  routes: RouteObject[];
  location: Location<any>;
};

export const Breadcrumb: FunctionComponent<BreadcrumbProps> = (props) => {
  const { routes, location } = props;
  const state = useSelector((state: RootType) => state);
  const breadcrumbs = useMemo(
    () => generateBreadcrumbs({ routes: routes, pathname: location.pathname, state: state }),
    [routes, location.pathname, state]
  );

  return (
    <BaseBreadcrumb
      items={breadcrumbs.map((item) => ({
        title: item.path ? <Link to={item.path}>{item.breadcrumb}</Link> : item.breadcrumb,
      }))}
    />
  );
};
