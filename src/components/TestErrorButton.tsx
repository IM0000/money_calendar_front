import React from 'react';

export default function TestErrorButton() {
  // 런타임 에러 발생 버튼 클릭 핸들러
  const handleRuntimeError = () => {
    // 존재하지 않는 객체의 메서드 호출 에러
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = null;
    obj.nonExistentMethod();
  };

  // 비동기 에러 발생 버튼 클릭 핸들러
  const handleAsyncError = () => {
    // Promise 내에서 에러 발생
    Promise.reject(new Error('테스트 비동기 에러입니다.'));
  };

  // React 렌더링 에러 발생 버튼 클릭 핸들러
  const handleRenderError = () => {
    // 상태 변경 후 렌더링에서 에러 발생 (React 18부터는 이렇게 바로 throw하면 에러 경계로 안잡힘)
    throw new Error('테스트 렌더링 에러입니다.');
  };

  return (
    <div className="m-4 flex flex-col gap-2">
      <h2 className="text-lg font-bold">테스트 에러 발생 버튼</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleRuntimeError}
          className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          런타임 에러 발생
        </button>
        <button
          onClick={handleAsyncError}
          className="rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
        >
          비동기 에러 발생
        </button>
        <button
          onClick={handleRenderError}
          className="rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
        >
          렌더링 에러 발생
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        * 이 버튼들은 에러 처리 테스트를 위한 것이며, 실제 배포 환경에서는
        제거해야 합니다.
      </p>
    </div>
  );
}
