export type Note = {
  id: string;
  title: string;
  content: string;
  date: string;
  isTaskList?: boolean;
  tasks?: Task[];
};

export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

export type RootStackParamList = {
  NotesList: undefined;
  EditNote: { note?: Note };
  NoteDetail: { note: Note };
};
