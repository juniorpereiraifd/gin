import { notification, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as UnityCreators } from 'src/store/modules/unity/actions';
import { type UnitAddress, type UnitBaseInformation } from 'src/store/modules/unity/reducer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { MapPin, Store } from 'lucide-react';
import { InformationForm } from './InformationForm';
import { AddressForm } from './AddressForm';

const { Step } = Steps;

const stepsContent = [
  {
    text: 'Vamos criar uma nova unidade! Informe-nos abaixo como deseja chamá-la, insira sua logo e uma foto de capa bem bonita.',
  },
  {
    text: 'Diga-nos também sua localização, assim seus clientes saberão onde encontrar essa unidade.',
  },
];

export const CreateUnityPage = () => {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const {
    unity: { saving, created },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if (created) {
      setCurrent(1);
      setDisabled(true);

      return;
    }

    if (current === 1 && !created) {
      setCurrent(0);
    }
  }, [created]);

  const onCreateUnit = (values: UnitBaseInformation) => {
    dispatch(
      UnityCreators.createUnityRequest({
        ...values,
      })
    );
  };

  const onEditUnit = (values: UnitAddress) => {
    if (created) {
      dispatch(
        UnityCreators.editUnityRequest({
          ...values,
          id: created?.id,
        })
      );

      return;
    }

    notification.error({
      message: 'Erro',
      description: 'Não foi possível configurar o endereço da sua unidade, tente novamente mais tarde.',
    });
  };

  const stepContent = (step: number) => {
    switch (step) {
      case 0:
        return <InformationForm saving={saving} onFinish={onCreateUnit} />;
      case 1:
        return <AddressForm saving={saving} onFinish={onEditUnit} disabled={disabled} setDisabled={setDisabled} />;
      default:
        return null;
    }
  };

  return (
    <section className="w-full h-full p-4 flex items-center justify-center">
      <div className="flex flex-col gap-4 w-1/2">
        <div className="flex flex-col items-center mb-4">
          <PageTitle>Criar unidade</PageTitle>
          <Steps current={current}>
            <Step
              icon={
                <div className="flex flex-col items-center gap-2">
                  <Store size={20} />
                  <span className="text-base">Informações</span>
                </div>
              }
            />
            <Step
              icon={
                <div className="flex flex-col items-center gap-2">
                  <MapPin size={20} />
                  <span className="text-base">Localização</span>
                </div>
              }
            />
          </Steps>
          <span className="text-slate-400 text-sm mt-4 text-center w-3/5">{stepsContent[current].text}</span>
        </div>
        <div>{stepContent(current)}</div>
      </div>
    </section>
  );
};
