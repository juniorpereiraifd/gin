import { useEffect, useState, type FunctionComponent } from 'react';
import { CircleCheck } from 'lucide-react';

type Requirement = {
  description: string;
  pattern: RegExp;
};

type Checklist = Requirement & {
  fulfilled: boolean;
};

type StrongPasswordFieldRequirementsProps = {
  value: string;
  requirements: Requirement[];
  className?: string;
};

export const StrongPasswordFieldRequirements: FunctionComponent<StrongPasswordFieldRequirementsProps> = (props) => {
  const { value, requirements, className } = props;
  const [checkList, setCheckList] = useState<Checklist[]>(
    requirements.map((requirement) => ({
      ...requirement,
      fulfilled: requirement.pattern.test(value),
    })),
  );

  useEffect(() => {
    setCheckList(
      requirements.map((requirement) => ({
        ...requirement,
        fulfilled: requirement.pattern.test(value),
      })),
    );
  }, [value, requirements]);

  return (
    <ul className={className}>
      {checkList.map((check) => (
        <li
          data-fulfilled={check.fulfilled}
          key={check.description}
          className="mb-4 flex items-center gap-2 text-xs text-slate-500 data-[fulfilled='true']:text-green-600"
        >
          <CircleCheck
            data-fulfilled={check.fulfilled}
            size={14}
            className="fill-slate-500 text-white data-[fulfilled='true']:fill-green-600"
          />
          {check.description}
        </li>
      ))}
    </ul>
  );
};
