const Participants = () => {
  return (
    <div className="absolute top-2 right-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-fit">
      Participants
    </div>
  );
};

Participants.Skeleton = function ParticipantsSkeleton() {
  return (
    <div className="absolute top-2 right-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[100px]" />
  );
};

export default Participants;
