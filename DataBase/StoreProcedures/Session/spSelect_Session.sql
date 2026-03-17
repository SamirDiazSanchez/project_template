CREATE PROCEDURE [dbo].[spSelect_Session]
  @UserId UNIQUEIDENTIFIER = NULL
AS
SET NOCOUNT ON;
BEGIN
  SELECT
    [SessionId],
    [UserId],
    [SessionHash],
    [IsActive],
    [CreatedAt],
    [ClosedAt]
  FROM [Session]
  WHERE [UserId] = @UserId
  AND [IsActive] = 1;
END
