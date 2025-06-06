import React from 'react';
import { UserDto } from '../../types/users-types';
import EditNickname from './EditNickname';
import { FaEnvelope } from 'react-icons/fa';
import { useAuthStore } from '../../zustand/useAuthStore';

interface BasicInfoProps {
  user: UserDto | null;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ user }) => {
  const { setUser } = useAuthStore();

  const handleSaveNickname = (nickname: string) => {
    if (user) {
      // 상태를 갱신합니다
      setUser({ ...user, nickname });
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-6 border-b border-gray-200 pb-2 text-xl font-bold text-gray-800">
        내 프로필
      </h2>

      <div className="space-y-6">
        <div className="flex flex-col">
          {/* 사용자 정보 */}
          <div className="space-y-4">
            {/* 이메일 */}
            <div className="border-b border-gray-100 pb-4">
              <label className="mb-2 flex items-center text-sm font-medium text-gray-600">
                <FaEnvelope className="mr-2 text-gray-400" />
                이메일
              </label>
              <div className="rounded-md bg-gray-50 p-3 font-medium text-gray-800">
                {user?.email || '이메일 없음'}
              </div>
            </div>

            {/* 닉네임 */}
            <EditNickname user={user} onSave={handleSaveNickname} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
