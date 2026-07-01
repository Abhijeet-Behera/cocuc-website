export const metadata = {
    title: "Data Deletion Instructions | Church of Christ",
    description:
        "Instructions for requesting deletion of information associated with the COC BBSR Website Gallery.",
};

export default function DataDeletionPage() {
    return (
        <main
            style={{
                maxWidth: "900px",
                minHeight: "70vh",
                margin: "0 auto",
                padding: "120px 24px 80px",
                lineHeight: "1.7",
            }}
        >
            <h1>Data Deletion Instructions</h1>

            <p>
                The COC BBSR Website Gallery uses the Instagram API to display
                photographs published by the Church of Christ, Union Church,
                Bhubaneswar Instagram account.
            </p>

            <p>
                This website does not create Instagram accounts for visitors and
                does not intentionally collect or store personal information from
                website visitors through the gallery.
            </p>

            <p>
                The application may temporarily cache limited Instagram media
                information, such as post identifiers, captions, image URLs,
                permalinks and publishing dates, to improve website performance.
            </p>

            <h2>Requesting data deletion</h2>

            <p>
                To request deletion of information associated with this
                application, contact us using the email address below.
            </p>

            <p>
                Email:{" "}
                <a href="mailto:cocbhubaneswar@gmail.com">
                    cocbhubaneswar@gmail.com
                </a>
            </p>

            <p>
                Subject: <strong>Instagram Gallery Data Deletion Request</strong>
            </p>

            <p>
                Include the relevant Instagram username and a description of the
                information you want removed. We will review valid requests and
                remove applicable information from our systems.
            </p>
        </main>
    );
}