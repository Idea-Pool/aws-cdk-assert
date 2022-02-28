import { Match, Matcher } from "aws-cdk-lib/assertions";
import { Resource } from "./resource";
import { S3Bucket } from "./s3";

/**
 * Matchers to use to assert CloudFormation template.
 */
export class AdvancedMatcher {
  /**
   * Matches the Fn function with the name and the passed values.
   * @param name The name of Fn function
   * @param pattern The values matched with Match.arrayWith()
   * @returns 
   */
  public static fn(name: string, ...pattern: any[]): Matcher {
    return Match.objectLike({
      ["Fn::" + name]: Match.arrayWith([...pattern]),
    });
  }

  /**
   * Matches a Fn::Select with the passed value.
   * @param pattern The value to match with.
   * @returns 
   */
  public static fnSelect(pattern: any): Matcher {
    return this.fn('Select', pattern);
  }

  /**
   * Matches a Fn::Split with the passed value.
   * @param pattern The value to match with.
   * @returns 
   */
  public static fnSplit(pattern: any): Matcher {
    return this.fn('Split', pattern);
  }

  /**
   * Matches a Fn::GetAtt with the passed values.
   * @param pattern The values to match with, in order.
   * @returns 
   */
  public static fnGetAtt(...pattern: any[]): Matcher {
    return this.fn('GetAtt', ...pattern);
  }

  /**
   * Matches a Fn::Equals with the passed values.
   * @param pattern The values to match with, in order.
   * @returns 
   */
  public static fnEquals(...pattern: any[]): Matcher {
    return this.fn('Equals', ...pattern);
  }

  /**
   * Matches a Fn::Join with the passed value.
   * @param pattern The value to match with.
   * @returns 
   */
  public static fnJoin(pattern: any): Matcher {
    return this.fn('Join', pattern);
  }

  /**
   * Matches with the website URL of the S3 Bucket.
   * @param s3Bucket The S3Bucket test construct.
   * @returns 
   */
  public static s3BucketWebsiteURL(s3Bucket: S3Bucket): Matcher {
    return this.fnSelect(
      this.fnSplit(
        this.fnGetAtt(s3Bucket.id, "WebsiteURL")
      )
    );
  }

  /**
   * Matches with the ARN of the test construct.
   * @param resource The test construct
   * @param attribute The attribute parsed for the ARN defaults to "Arn".
   * @returns 
   */
  public static arn(resource: Resource, attribute?: string): Matcher {
    return this.fnGetAtt(resource.id, attribute || "Arn")
  }
}