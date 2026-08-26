import React from 'react';
import { useContent } from '@/lib/content';
import EditableText from './EditableText';

export default function EditField({ k, as = 'p', className = '', multiline = false }) {
  const { t, setText } = useContent();
  return (
    <EditableText
      as={as}
      className={className}
      multiline={multiline}
      value={t(k)}
      onChange={(v) => setText(k, v)}
    />
  );
}