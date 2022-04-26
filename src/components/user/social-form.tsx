import React, { useState } from 'react';
import { TextInputBox } from 'src/components/common';
import { FaDiscord, FaTwitter, FaFacebook, FaTelegram } from 'react-icons/fa';

export const SocialForm = () => {
  const [userName, setUserName] = useState('');

  return (
    <div>
      <label className="font-body">Social</label>

      <div className="my-4">
        <TextInputBox
          type="text"
          icon={<FaDiscord className="text-xl" />}
          value={userName}
          label="Discord Username"
          placeholder=""
          onChange={(value) => {
            setUserName(value);
          }}
        />
      </div>
      <div className="my-4">
        <TextInputBox
          type="text"
          icon={<FaTwitter className="text-xl" />}
          value={userName}
          label="Twitter Username"
          placeholder=""
          onChange={(value) => {
            setUserName(value);
          }}
        />
      </div>
      <div className="my-4">
        <TextInputBox
          type="text"
          icon={<FaTelegram className="text-xl" />}
          value={userName}
          label="Telegram Username"
          placeholder=""
          onChange={(value) => {
            setUserName(value);
          }}
        />
      </div>
      <div className="my-4">
        <TextInputBox
          type="text"
          icon={<FaFacebook className="text-xl" />}
          value={userName}
          label="Facebook Username"
          placeholder=""
          onChange={(value) => {
            setUserName(value);
          }}
        />
      </div>
    </div>
  );
};
