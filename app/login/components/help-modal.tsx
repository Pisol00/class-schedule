import React from 'react';

export function HelpModalContent() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-gray-900 mb-2">วิธีการเข้าสู่ระบบ</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          1. คลิกปุ่ม "เข้าสู่ระบบด้วย Google"<br/>
          2. เลือกบัญชี Google ของคุณ<br/>
          3. ยืนยันการเข้าสู่ระบบ
        </p>
      </div>
      <div>
        <h3 className="font-medium text-gray-900 mb-2">ติดต่อสอบถาม</h3>
        <p className="text-gray-600 text-sm">
          หากมีปัญหาในการเข้าสู่ระบบ กรุณาติดต่อ IT Support
        </p>
      </div>
    </div>
  );
}

export function PrivacyModalContent() {
  return (
    <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
      <p>
        เราใช้ข้อมูลของคุณเพื่อการจัดตารางการสอนและการจัดการระบบเท่านั้น
      </p>
      <div>
        <h3 className="font-medium text-gray-900 mb-2">การเก็บรักษาข้อมูล</h3>
        <p>
          ข้อมูลส่วนบุคคลของคุณจะถูกเก็บรักษาไว้อย่างปลอดภัยและจะไม่ถูกเปิดเผยต่อบุคคลที่สาม
        </p>
      </div>
      <div>
        <h3 className="font-medium text-gray-900 mb-2">การใช้งาน</h3>
        <p>
          ข้อมูลจะถูกใช้เพื่อการจัดการระบบการเรียนการสอนและการติดต่อสื่อสารที่จำเป็นเท่านั้น
        </p>
      </div>
    </div>
  );
}