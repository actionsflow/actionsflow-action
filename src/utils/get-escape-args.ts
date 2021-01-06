import shellEscape from "shell-escape";
export const getEscapedArgs = (str: string): string => {
  const escaped = shellEscape([str]);
  return escaped;
};
