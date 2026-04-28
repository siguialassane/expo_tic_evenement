import Image from "next/image";

function splitFullNameLines(fullName: string) {
  const normalizedFullName = fullName.replace(/\s+/g, " ").trim();
  const words = normalizedFullName.split(" ").filter(Boolean);

  if (words.length <= 1 || normalizedFullName.length <= 16) {
    return [normalizedFullName];
  }

  let bestLines = [normalizedFullName];
  let bestScore = Number.POSITIVE_INFINITY;

  for (let index = 1; index < words.length; index += 1) {
    const firstLine = words.slice(0, index).join(" ");
    const secondLine = words.slice(index).join(" ");
    const longestLineLength = Math.max(firstLine.length, secondLine.length);
    const lengthGap = Math.abs(firstLine.length - secondLine.length);
    const splitBalance = Math.abs(words.length / 2 - index);
    const score = longestLineLength * 100 + lengthGap * 10 + splitBalance;

    if (score < bestScore) {
      bestLines = [firstLine, secondLine];
      bestScore = score;
    }
  }

  return bestLines;
}

function getFullNameFontSize(fullNameLines: string[]) {
  const longestLineLength = Math.max(...fullNameLines.map((line) => line.length));

  if (fullNameLines.length > 1) {
    if (longestLineLength > 18) {
      return 20;
    }

    if (longestLineLength > 15) {
      return 24;
    }

    if (longestLineLength > 12) {
      return 28;
    }

    return 32;
  }

  if (longestLineLength > 34) {
    return 24;
  }

  if (longestLineLength > 28) {
    return 28;
  }

  if (longestLineLength > 22) {
    return 32;
  }

  if (longestLineLength > 16) {
    return 36;
  }

  return 40;
}

function getRoleFontSize(role: string) {
  if (role.length > 42) {
    return 10;
  }

  if (role.length > 30) {
    return 12;
  }

  if (role.length > 20) {
    return 13;
  }

  return 15;
}

function getNameTop(fullNameLines: string[]) {
  return fullNameLines.length > 1 ? "29.4%" : "31%";
}

function getRoleTop(fullNameLines: string[]) {
  return fullNameLines.length > 1 ? "45.4%" : "46.6%";
}

interface ParticipantBadgePreviewProps {
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
}

export function ParticipantBadgePreview({
  firstName,
  lastName,
  role,
}: ParticipantBadgePreviewProps) {
  const hasIdentity = Boolean(firstName?.trim() || lastName?.trim());

  const resolvedFullName = hasIdentity
    ? [lastName?.trim(), firstName?.trim()].filter(Boolean).join(" ")
    : "KOUASSI Jean-Baptiste";
  const resolvedRole = role?.trim() || "Directeur General";

  const fullNameLines = splitFullNameLines(resolvedFullName);
  const fullNameFontSize = getFullNameFontSize(fullNameLines);
  const roleFontSize = getRoleFontSize(resolvedRole);
  const fullNameTop = getNameTop(fullNameLines);
  const roleTop = getRoleTop(fullNameLines);

  return (
    <div className="w-full max-w-[397px]">
      <div className="relative aspect-[527/746] overflow-hidden bg-white">
        <Image
          src="/badge.png"
          alt=""
          fill
          priority
          unoptimized
          className="object-cover"
        />

        <div
          className="absolute left-1/2 w-[82%] -translate-x-1/2 text-center text-[#0b733a]"
          style={{ top: fullNameTop }}
        >
          <p
            className="font-black uppercase leading-[0.98] tracking-[-0.04em]"
            style={{ fontSize: `${fullNameFontSize}px` }}
          >
            {fullNameLines.map((line, index) => (
              <span key={`${line}-${index}`} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </p>
        </div>

        <div
          className="absolute left-1/2 w-[58%] -translate-x-1/2 text-center text-[#4a4a4a]"
          style={{ top: roleTop }}
        >
          <p
            className="text-balance font-medium leading-[1.08] tracking-[-0.02em]"
            style={{ fontSize: `${roleFontSize}px` }}
          >
            {resolvedRole}
          </p>
        </div>
      </div>
    </div>
  );
}