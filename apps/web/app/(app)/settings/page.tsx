'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Modal from '../../../components/Modal';
import SectionLabel from '../../../components/SectionLabel';
import type { CreateBabyDto, CreateInvitationDto } from '@yuna/shared-types';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  babies: { id: string; name: string; role: string }[];
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showBabyModal, setShowBabyModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [babyName, setBabyName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteBabyId, setInviteBabyId] = useState('');
  const [message, setMessage] = useState('');

  const loadUser = useCallback(() => {
    api
      .get<{ data: UserInfo }>('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => router.push('/login'));
  }, [router]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleCreateBaby = async () => {
    if (!babyName.trim()) return;
    try {
      const dto: CreateBabyDto = { name: babyName.trim() };
      await api.post('/babies', dto);
      setBabyName('');
      setShowBabyModal(false);
      setMessage('Baby가 등록되었습니다!');
      loadUser();
    } catch {
      setMessage('Baby 등록에 실패했습니다.');
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !inviteBabyId) return;
    try {
      const dto: CreateInvitationDto = {
        babyId: inviteBabyId,
        inviteeEmail: inviteEmail.trim(),
      };
      await api.post('/invitations', dto);
      setInviteEmail('');
      setShowInviteModal(false);
      setMessage('초대가 발송되었습니다! (콘솔에서 링크를 확인하세요)');
    } catch {
      setMessage('초대 발송에 실패했습니다.');
    }
  };

  const handleLogout = async () => {
    await api.post('/auth/logout');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="font-display text-xl font-bold text-inkroot">설정</h2>

      {/* 알림 메시지 */}
      {message && (
        <div className="bg-fresh-stem/10 text-fresh-stem text-sm rounded-4xl p-4 animate-fade-in">
          {message}
          <button
            onClick={() => setMessage('')}
            className="ml-2 text-fresh-stem/60 hover:text-fresh-stem"
          >
            ✕
          </button>
        </div>
      )}

      {/* 사용자 정보 */}
      <section className="bg-pure-light rounded-4xl border border-inkroot/5 p-5">
        <SectionLabel>내 정보</SectionLabel>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-inkroot/50">이름</span>
            <span className="text-inkroot font-medium">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-inkroot/50">이메일</span>
            <span className="text-inkroot font-medium">{user.email}</span>
          </div>
        </div>
      </section>

      {/* Baby 관리 */}
      <section className="bg-pure-light rounded-4xl border border-inkroot/5 p-5">
        <div className="flex items-center justify-between mb-3">
          <SectionLabel className="mb-0">내 Baby</SectionLabel>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowBabyModal(true)}
          >
            + Baby 등록
          </Button>
        </div>

        {user.babies.length === 0 ? (
          <p className="text-inkroot/40 text-sm">
            등록된 Baby가 없습니다.
          </p>
        ) : (
          <div className="space-y-2">
            {user.babies.map((baby) => (
              <div
                key={baby.id}
                className="flex items-center justify-between py-2 border-b border-inkroot/5 last:border-0"
              >
                <div>
                  <span className="font-medium text-inkroot text-sm">
                    {baby.name}
                  </span>
                  <span className="ml-2 text-xs text-inkroot/40 bg-inkroot/5 px-2 py-0.5 rounded-full">
                    {baby.role}
                  </span>
                </div>
                {baby.role === 'OWNER' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setInviteBabyId(baby.id);
                      setShowInviteModal(true);
                    }}
                  >
                    초대하기
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 로그아웃 */}
      <Button
        variant="ghost"
        fullWidth
        onClick={handleLogout}
        className="text-blush-berry"
      >
        로그아웃
      </Button>

      {/* Baby 등록 모달 */}
      <Modal
        isOpen={showBabyModal}
        onClose={() => setShowBabyModal(false)}
        title="Baby 등록"
      >
        <div className="space-y-4">
          <Input
            placeholder="Baby 이름"
            value={babyName}
            onChange={(e) => setBabyName(e.target.value)}
            autoFocus
          />
          <Button
            variant="primary"
            fullWidth
            onClick={handleCreateBaby}
            disabled={!babyName.trim()}
          >
            등록하기
          </Button>
        </div>
      </Modal>

      {/* 초대 모달 */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="가족 초대"
      >
        <div className="space-y-4">
          <p className="text-inkroot/60 text-sm">
            초대할 가족의 이메일을 입력하세요.
          </p>
          <Input
            type="email"
            placeholder="이메일 주소"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            autoFocus
          />
          <Button
            variant="primary"
            fullWidth
            onClick={handleInvite}
            disabled={!inviteEmail.trim()}
          >
            초대 발송
          </Button>
        </div>
      </Modal>
    </div>
  );
}
