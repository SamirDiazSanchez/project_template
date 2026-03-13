CREATE PROCEDURE [dbo].[spSelect_User]
  @UserId UNIQUEIDENTIFIER = NULL,
  @Email VARCHAR(200) = NULL,
  @Search VARCHAR(200) = NULL,
  @PageNumber INT = 1,
  @PageSize INT = 10,
  @TotalRecords INT OUTPUT
AS
SET NOCOUNT ON;
BEGIN
  IF @UserId IS NOT NULL
  BEGIN
    SET @TotalRecords = 1;

    SELECT
      [UserId],
      [UserName],
      [Email],
      [Role],
      [IsActive],
      [CreatedBy],
      [CreatedAt],
      [UpdatedBy],
      [UpdatedAt]
    FROM [User]
    WHERE [UserId] = @UserId;
    RETURN;
  END

  IF @Email IS NOT NULL
  BEGIN
    SET @TotalRecords = 1;

    SELECT
      [UserId],
      [UserName],
      [Email],
      [Role],
      [IsActive],
      [CreatedBy],
      [CreatedAt],
      [UpdatedBy],
      [UpdatedAt]
    FROM [User]
    WHERE [Email] = @Email
    AND [IsActive] = 1;
    RETURN;
  END

  IF @Search IS NOT NULL
  BEGIN
    SET @TotalRecords = (
      SELECT COUNT(*) FROM [User]
      WHERE [UserName] LIKE '%' + @Search + '%'
      OR [Email] LIKE '%' + @Search + '%'
      OR [Role] LIKE '%' + @Search + '%'
    );

    SELECT
      [UserId],
      [UserName],
      [Email],
      [Role],
      [IsActive],
      [CreatedBy],
      [CreatedAt],
      [UpdatedBy],
      [UpdatedAt]
    FROM [User]
    WHERE [UserName] LIKE '%' + @Search + '%'
    OR [Email] LIKE '%' + @Search + '%'
    OR [Role] LIKE '%' + @Search + '%'
    ORDER BY [CreatedAt] DESC
    OFFSET (@PageNumber - 1) * @PageSize ROWS FETCH NEXT @PageSize ROWS ONLY;
    RETURN;
  END

  SET @TotalRecords = (SELECT COUNT(*) FROM [User]);
  SELECT
    [UserId],
    [UserName],
    [Email],
    [Role],
    [IsActive],
    [CreatedBy],
    [CreatedAt],
    [UpdatedBy],
    [UpdatedAt]
  FROM [User]
  ORDER BY [CreatedAt] DESC
  OFFSET (@PageNumber - 1) * @PageSize ROWS FETCH NEXT @PageSize ROWS ONLY;
END
