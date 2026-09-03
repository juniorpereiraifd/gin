import { MODULES_KEYS } from 'src/store/modules/unity/reducer';

type ModuleKey = typeof MODULES_KEYS[number];

export type ModuleKeyCustomerFlow = Exclude<ModuleKey, 'menu' | 'voucher' | 'nps' | 'marketing'>;

export type ModuleKeyWithoutMenu = Exclude<ModuleKey, 'menu'>;

type Copy = {
    title: string;
    description: string;
};

type CustomerFlowModuleCopyRecord = Record<ModuleKeyCustomerFlow, Copy>;

type CommunicationModuleCopyRecord = Record<ModuleKeyWithoutMenu, Copy>;

type ModuleInactiveCopy = {
    flow: CustomerFlowModuleCopyRecord;
    communication: CommunicationModuleCopyRecord;
};

export const moduleInactiveCopy: ModuleInactiveCopy = {
    flow: {
        'reservation': {
            title: 'Módulo de Reserva bloqueado',
            description: `Acompanhe o fluxo de clientes no seu restaurante com o Módulo de Reservas. 
                Veja o fluxo de reservas com base no período que deseja além de números detalhados como total de reservas, 
                receita gerada, fluxo por dia da semana e outros dados que irão te ajudar a entender melhor o comportamento dos seus clientes.`
        },
        'line': {
            title: 'Módulo de Fila bloqueado',
            description: `Acompanhe o fluxo de clientes no seu restaurante com o Módulo de Fila de espera. 
                Veja o fluxo de filas com base no período que deseja além de números detalhados como total de filas, 
                receita gerada, fluxo por dia da semana, tempo médio de espera e outros dados que irão te ajudar a entender melhor o comportamento dos seus clientes.`
        },
    },
    communication: {
        'reservation': {
            title: 'Módulo de Reserva bloqueado',
            description: `Acompanhe o consumo de SMS e e-mails com o Módulo de Reserva. 
                Entenda como seus envios estão distribuídos, organizados por tipo e período selecionado, para otimizar o uso desses recursos.`
        },
        'line': {
            title: 'Módulo de Fila bloqueado',
            description: `Acompanhe o consumo de SMS e e-mails com o Módulo de Fila. 
                Entenda como seus envios estão distribuídos, organizados por tipo e período selecionado, para otimizar o uso desses recursos.`
        },
        'voucher': {
            title: 'Módulo de Giftback bloqueado',
            description: `Acompanhe o consumo de SMS e e-mails com o Módulo de Giftback. 
                Entenda como seus envios estão distribuídos, organizados por tipo e período selecionado, para otimizar o uso desses recursos.`
        },
        'nps': {
            title: 'Módulo de Avaliações bloqueado',
            description: `Acompanhe o consumo de SMS e e-mails com o Módulo de Avaliações. 
                Entenda como seus envios estão distribuídos, organizados por tipo e período selecionado, para otimizar o uso desses recursos.`
        },
        'marketing': {
            title: 'Módulo de Marketing bloqueado',
            description: `Acompanhe o consumo de SMS e e-mails com o Módulo de Marketing. 
                Entenda como seus envios estão distribuídos, organizados por tipo e período selecionado, para otimizar o uso desses recursos.`
        },
    }
};