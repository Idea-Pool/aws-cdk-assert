import { Match, Matcher } from "aws-cdk-lib/assertions";
import { Resource } from "./resource";
import { S3Bucket } from "./s3";

export class AdvancedMatcher {
  public static fn(name: string, ...pattern: any[]): Matcher {
    return Match.objectLike({
      ["Fn::" + name]: Match.arrayWith([...pattern]),
    });
  }

  public static fnSelect(pattern: any): Matcher {
    return this.fn('Select', pattern);
  }

  public static fnSplit(pattern: any): Matcher {
    return this.fn('Split', pattern);
  }

  public static fnGetAtt(...pattern: any[]): Matcher {
    return this.fn('GetAtt', ...pattern);
  }

  public static fnJoin(pattern: any): Matcher {
    return this.fn('Join', pattern);
  }

  public static s3BucketWebsiteURL(s3Bucket: S3Bucket): Matcher {
    return this.fnSelect(
      this.fnSplit(
        this.fnGetAtt(s3Bucket.id, "WebsiteURL")
      )
    );
  }

  public static arn(resource: Resource, attribute?: string): Matcher {
    return this.fnGetAtt(resource.id, attribute || "Arn")
  }
}