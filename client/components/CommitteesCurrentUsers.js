import CurrentSection from "./CommitteesCurrentSection";

function CommitteesCurrentUsers({ currentNames }) {
    const isEmpty = currentNames === undefined || currentNames.length == 0;

    return (
        <div className="mt-6 mx-20">
            <h3 className="text-lg font-bold">Current Users:</h3>

            <div
                style={{
                    border: "solid",
                    borderRadius: "10px",
                    borderWidth: "2px",
                    borderColor: "rgb(22, 45, 255)",
                }}
                className="my-6 flex flex-col items-center"
            >
                {isEmpty ? (
                    <p className="my-6">No Current Members.</p>
                ) : (
                    <CurrentSection currentNames />
                )}
            </div>
        </div>
    );
}

export default CommitteesCurrentUsers;
