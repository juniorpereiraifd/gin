import { Card, Skeleton } from 'antd';
import Logo from 'src/stories/utils/Logo';

export const UnitsListScreenLoading = () => {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <div className="w-full h-full flex flex-col">
        <header className="w-full border-b flex items-center justify-between border-gray-200 py-4 bg-white">
          <div className="w-64 flex items-center justify-center border-r border-gray-200">
            <Logo size="large" />
          </div>
          <div className="flex items-center gap-3 pr-8">
            <Skeleton.Button active shape="circle" />
            <Skeleton.Button active size="small" className="!w-24" />
          </div>
        </header>
        <main className="flex-1 flex">
          <aside className="w-64 flex flex-col gap-4 py-4 px-2 border-r border-gray-200 bg-white">
            <Skeleton.Button active className="!w-full" />
          </aside>
          <div className="flex-1 flex flex-col bg-background-50 p-6">
            <Skeleton.Button active className="!w-52" />
            <div className="grid grid-cols-4 gap-4 mt-16">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card
                  key={index}
                  cover={
                    <div className="w-full h-36 p-4">
                      <Skeleton.Image active className="!w-full !h-full" />
                    </div>
                  }
                >
                  <Card.Meta title={<Skeleton.Button active className="!w-52" />} />
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
