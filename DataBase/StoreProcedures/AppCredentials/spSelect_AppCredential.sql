CREATE PROCEDURE [dbo].[spSelect_AppCredential]
  @ClientId UNIQUEIDENTIFIER = NULL,
  @Search VARCHAR(200) = NULL,
  @PageNumber INT = 1,
  @PageSize INT = 10,
  @TotalRecords INT OUTPUT
AS
BEGIN
  DECLARE @CurrentDate DATETIME = GETUTCDATE();

  IF @ClientId IS NOT NULL
  BEGIN
    SELECT
      A.[ClientId],
      A.[ClientSecret],
      A.[CreatedAt],
      A.[UpdatedAt],
      A.[IsActive],
      A.[CreatedBy],
      B.[UserName]
    FROM [dbo].[AppCredential] A
    INNER JOIN [dbo].[User] B
      ON A.[ClientId] = B.[UserId]
    WHERE [ClientId] = @ClientId;
    RETURN;
  END

  SET @TotalRecords = (SELECT COUNT(*) FROM [dbo].[AppCredential] A
    INNER JOIN [dbo].[User] B
      ON A.[ClientId] = B.[UserId]);

  SELECT
    A.[ClientId],
    A.[CreatedAt],
    A.[UpdatedAt],
    A.[IsActive],
    A.[CreatedBy],
    B.[UserName]
  FROM [dbo].[AppCredential] A
  INNER JOIN [dbo].[User] B
    ON A.[ClientId] = B.[UserId]
  ORDER BY A.[CreatedAt] DESC
  OFFSET (@PageNumber - 1) * @PageSize ROWS FETCH NEXT @PageSize ROWS ONLY;
END
