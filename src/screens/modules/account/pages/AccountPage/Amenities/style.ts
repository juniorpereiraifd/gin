import styled from 'styled-components';
import { Checkbox as CustomCheckbox } from 'antd';

export const Container = styled.div`
  width: 100%;
  height: 100%;

  padding: 1.25rem 1.25rem 0.625rem;
`;

export const Subtitle = styled.span`
  font-size: 1rem;
  color: rgba(103, 102, 102, 1);
`;

export const WrapperOptions = styled(CustomCheckbox.Group)`
  display: flex;
  flex-direction: column;

  .ant-checkbox-wrapper {
    margin-left: 0.625rem;
  }
`;

export const Checkbox = styled(CustomCheckbox)`
  margin-block: 0.312rem;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ContainerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 6.25rem;

  font-size: 1.25rem;
`;
