import { FunctionComponent, useEffect, useState } from 'react';
import { Input } from 'antd';
import { Email } from '@styled-icons/entypo/Email';
import { Sms } from '@styled-icons/material-outlined/Sms';
import { LineChart } from '@styled-icons/remix-line/LineChart';
import { Switch } from 'src/stories/entry/Switch';
import { ModuleCopy } from '../index';
import * as S from './styles';

const optionsParser = {
  'single-choice': 'Opções',
  scale: 'Escala',
  'short-answer': 'Texto curto',
  'long-answer': 'Texto longo',
};

type Option = {
  label: string;
  value: 'single-choice' | 'scale' | 'short-answer' | 'long-answer';
};

const options: Option[] = [
  { label: 'Opções', value: 'single-choice' },
  { label: 'Escala', value: 'scale' },
  { label: 'Texto curto', value: 'short-answer' },
  { label: 'Texto longo', value: 'long-answer' },
];

type CustomQuestion = {
  id: string;
  title: string;
  type: Option['value'];
  active: boolean;
  isEditing: boolean;
};

const CustomQuestionList: FunctionComponent = () => {
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([
    {
      id: '1',
      title: 'Qual nota você daria para nossa comida?',
      type: 'single-choice',
      active: true,
      isEditing: true,
    },
    {
      id: '2',
      title: 'Qual nota você daria para nosso atendimento?',
      type: 'scale',
      active: false,
      isEditing: false,
    },
    {
      id: '3',
      title: 'Qual sua sugestão para melhorarmos?',
      type: 'long-answer',
      active: true,
      isEditing: false,
    },
  ]);
  const [titleEditing, setTitleEditing] = useState<string>('');

  useEffect(() => {
    customQuestions.forEach((question) => {
      if (question.isEditing === true) {
        setTitleEditing(question.title);
      }
    });
  }, []);

  const handleChangeQuestionActive = (checked: boolean, questionId: string) => {
    setCustomQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? {
              ...question,
              active: checked,
              isEditing: checked === false ? false : question.isEditing,
            }
          : question
      )
    );
  };

  const handleChangeTitle = (title: string) => {
    setTitleEditing(title);
  };

  const handleChangeQuestionType = (
    type: Option['value'],
    questionId: string
  ) => {
    setCustomQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? { ...question, type, title: titleEditing }
          : question
      )
    );
  };

  const handleClickQuestion = (questionId: string) => {
    setCustomQuestions((prev) =>
      prev.map((question) => {
        if (question.id === questionId) {
          if (question.isEditing === false) {
            setTitleEditing(question.title);

            return { ...question, isEditing: !question.isEditing };
          }

          return { ...question, title: titleEditing, isEditing: false };
        } else {
          if (question.isEditing === true) {
            return { ...question, title: titleEditing, isEditing: false };
          }
          return { ...question, isEditing: false };
        }
      })
    );
  };

  return (
    <S.CustomQuestionContent>
      {customQuestions.map((question, index) => (
        <S.Question
          isActive={question.active}
          isEditing={question.isEditing}
          key={`${question.title}-${index}`}
          onClick={() =>
            question.active === true ? handleClickQuestion(question.id) : null
          }
        >
          <div className="main-content">
            <Switch
              checked={question.active}
              onChange={(checked, event) => {
                event.stopPropagation();
                handleChangeQuestionActive(checked, question.id);
              }}
            />
            <div className="question-info">
              <span className="title">
                {question.isEditing === true ? titleEditing : question.title}
              </span>
              <span className="question-type">
                {optionsParser[question.type]}
              </span>
            </div>
          </div>
          {question.isEditing === true && (
            <div className="question-settings">
              <Input
                placeholder="Título"
                value={titleEditing}
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => handleChangeTitle(event.target.value)}
              />
              <S.Types>
                {options.map((option) => (
                  <S.TypeButton
                    key={option.value}
                    isActive={question.type === option.value}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleChangeQuestionType(option.value, question.id);
                    }}
                  >
                    {option.label}
                  </S.TypeButton>
                ))}
              </S.Types>
            </div>
          )}
        </S.Question>
      ))}
    </S.CustomQuestionContent>
  );
};

export const npsBentoGridContent: ModuleCopy = {
  title: 'Avaliações',
  features: [
    {
      title: 'Pesquisa de satisfação',
      description:
        'Ofereça uma pesquisa de satisfação aos seus clientes para identificar pontos fortes e fracos da sua operação, ajudando a criar uma experiência mais satisfatória.',
      content: (
        <S.SatisfactionSurvey>
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/satisfaction-survey.webp`}
          />
        </S.SatisfactionSurvey>
      ),
    },
    {
      title: 'Relatórios de Respostas',
      description:
        'Este produto te proporciona dados quantitativos e qualitativos que podem guiar decisões estratégicas.',
      content: (
        <div className="content">
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/nps-report.svg`}
          />
        </div>
      ),
    },
    {
      title: 'Disparo automatico de SMS e Email',
      description:
        'Aumente suas taxas de respostas, enviando a pesquisa por SMS e e-mail, tirando a necessidade de mandar um QR Code junto com a conta (também temos essa opção).',
      content: (
        <S.Communication>
          <div className="reservation">
            <Email size={25} />
          </div>
          <div className="line left" />
          <div className="money">
            <LineChart size={30} />
          </div>
          <div className="line right" />
          <div className="experience">
            <Sms size={25} />
          </div>
        </S.Communication>
      ),
    },
    {
      title: 'Crie sua própria pesquisa',
      description:
        'Customize as perguntas da sua pesquisa e deixe-a da forma que desejar!',
      content: <CustomQuestionList />,
    },
  ],
};
