import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MentionListProps {
  items: Array<{
    id: string;
    name: string;
    avatar: string | null;
  }>;
  command: (args: { id: string; label: string }) => void;
}

export const MentionList = forwardRef((props: MentionListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item.id, label: item.name });
    }
  };

  const upHandler = () => {
    setSelectedIndex((index) => 
      index <= 0 ? props.items.length - 1 : index - 1
    );
  };

  const downHandler = () => {
    setSelectedIndex((index) => 
      index >= props.items.length - 1 ? 0 : index + 1
    );
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }
      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }
      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  return (
    <div className="bg-popover rounded-md shadow-md overflow-hidden">
      {props.items.length ? (
        <div className="py-1">
          {props.items.map((item, index) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm
                ${index === selectedIndex ? 'bg-accent' : 'hover:bg-accent/50'}
              `}
              onClick={() => selectItem(index)}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={item.avatar || undefined} />
                <AvatarFallback>{item.name[0]}</AvatarFallback>
              </Avatar>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-3 py-2 text-sm text-muted-foreground">
          No users found
        </div>
      )}
    </div>
  );
});

MentionList.displayName = 'MentionList';
